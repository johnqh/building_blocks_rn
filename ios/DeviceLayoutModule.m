#import "DeviceLayoutModule.h"
#import <UIKit/UIKit.h>

static NSString *const kDeviceLayoutChanged = @"deviceLayoutChanged";

@implementation DeviceLayoutModule {
  BOOL _observing;
  NSDictionary *_lastReported;
}

RCT_EXPORT_MODULE();

+ (BOOL)requiresMainQueueSetup {
  return YES;
}

- (NSArray<NSString *> *)supportedEvents {
  return @[ kDeviceLayoutChanged ];
}

/// The key window's scene: what orientation and traits are asked of.
+ (UIWindow *)keyWindow {
  for (UIScene *scene in UIApplication.sharedApplication.connectedScenes) {
    if (![scene isKindOfClass:UIWindowScene.class]) continue;
    for (UIWindow *window in ((UIWindowScene *)scene).windows) {
      if (window.isKeyWindow) return window;
    }
  }
  return nil;
}

+ (NSDictionary *)layout {
  UIWindow *window = [self keyWindow];
  UIInterfaceOrientation orientation =
      window.windowScene ? window.windowScene.interfaceOrientation
                         : UIInterfaceOrientationUnknown;
  UITraitCollection *traits = window ? window.traitCollection
                                     : UIScreen.mainScreen.traitCollection;
  return @{
    @"interfaceOrientation" : @(orientation),
    @"horizontalSizeClass" : @(traits.horizontalSizeClass),
    @"verticalSizeClass" : @(traits.verticalSizeClass),
  };
}

/// Read once at start-up: `getConstants` is synchronous, so the first
/// render has the real orientation rather than a guess.
- (NSDictionary *)constantsToExport {
  return [DeviceLayoutModule layout];
}

RCT_EXPORT_METHOD(getLayout:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
  dispatch_async(dispatch_get_main_queue(), ^{
    resolve([DeviceLayoutModule layout]);
  });
}

- (void)startObserving {
  _observing = YES;
  // The device's own rotation fires before the interface has followed it,
  // so the answer is read on the next turn of the main loop, when the scene
  // has. Trait changes (size classes) arrive through the same notification
  // on a rotation; a split-screen change on an iPad has none, and is read on
  // the next rotation or start-up.
  [NSNotificationCenter.defaultCenter
      addObserver:self
         selector:@selector(orientationDidChange:)
             name:UIDeviceOrientationDidChangeNotification
           object:nil];
  [UIDevice.currentDevice beginGeneratingDeviceOrientationNotifications];
}

- (void)stopObserving {
  _observing = NO;
  [NSNotificationCenter.defaultCenter removeObserver:self];
  [UIDevice.currentDevice endGeneratingDeviceOrientationNotifications];
}

/// The device turns before the interface follows: the scene's orientation
/// is still the old one when the device's notification arrives, and is the
/// new one somewhere inside the rotation's animation. So it is read twice,
/// just after and after the animation has had its time, and reported each
/// time it differs from what was last reported.
- (void)orientationDidChange:(NSNotification *)notification {
  if (!_observing) return;
  [self reportAfter:0.05];
  [self reportAfter:0.6];
}

- (void)reportAfter:(NSTimeInterval)delay {
  dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(delay * NSEC_PER_SEC)),
                 dispatch_get_main_queue(), ^{
    if (!self->_observing) return;
    NSDictionary *layout = [DeviceLayoutModule layout];
    if ([layout isEqualToDictionary:self->_lastReported]) return;
    self->_lastReported = layout;
    [self sendEventWithName:kDeviceLayoutChanged body:layout];
  });
}

@end
