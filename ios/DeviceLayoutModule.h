#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

/// The interface orientation and the window's size classes, as UIKit
/// reports them, with an event whenever either changes. JavaScript can see
/// the window's shape and the safe area, but not which way round a landscape
/// iPhone is held — iOS insets both sides alike — nor the size classes.
@interface DeviceLayoutModule : RCTEventEmitter <RCTBridgeModule>
@end
