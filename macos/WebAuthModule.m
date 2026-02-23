#import "WebAuthModule.h"
#import <AuthenticationServices/AuthenticationServices.h>
#import <CommonCrypto/CommonDigest.h>
#import <Security/Security.h>

@interface WebAuthModule () <ASWebAuthenticationPresentationContextProviding>
@property (nonatomic, strong) ASWebAuthenticationSession *authSession;
@end

@implementation WebAuthModule

RCT_EXPORT_MODULE();

+ (BOOL)requiresMainQueueSetup {
  return YES;
}

RCT_EXPORT_METHOD(authenticate:(NSString *)urlString
                  callbackURLScheme:(NSString *)callbackURLScheme
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
  dispatch_async(dispatch_get_main_queue(), ^{
    NSURL *authURL = [NSURL URLWithString:urlString];
    if (!authURL) {
      reject(@"INVALID_URL", @"Invalid authentication URL", nil);
      return;
    }

    self.authSession =
      [[ASWebAuthenticationSession alloc]
        initWithURL:authURL
        callbackURLScheme:callbackURLScheme
        completionHandler:^(NSURL * _Nullable callbackURL,
                            NSError * _Nullable error) {
          self.authSession = nil;
          if (error) {
            if (error.code == ASWebAuthenticationSessionErrorCodeCanceledLogin) {
              resolve([NSNull null]);
            } else {
              reject(@"AUTH_ERROR", error.localizedDescription, error);
            }
            return;
          }
          if (callbackURL) {
            resolve(callbackURL.absoluteString);
          } else {
            resolve([NSNull null]);
          }
        }];

    self.authSession.presentationContextProvider = self;
    self.authSession.prefersEphemeralWebBrowserSession = NO;

    if (![self.authSession start]) {
      self.authSession = nil;
      reject(@"SESSION_ERROR",
             @"Failed to start authentication session", nil);
    }
  });
}

RCT_EXPORT_METHOD(generateCodeVerifier:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
  uint8_t randomBytes[32];
  OSStatus status = SecRandomCopyBytes(kSecRandomDefault, 32, randomBytes);
  if (status != errSecSuccess) {
    reject(@"RANDOM_ERROR", @"Failed to generate random bytes", nil);
    return;
  }

  NSData *data = [NSData dataWithBytes:randomBytes length:32];
  NSString *base64 = [data base64EncodedStringWithOptions:0];
  NSString *base64url = base64;
  base64url = [base64url stringByReplacingOccurrencesOfString:@"+" withString:@"-"];
  base64url = [base64url stringByReplacingOccurrencesOfString:@"/" withString:@"_"];
  base64url = [base64url stringByReplacingOccurrencesOfString:@"=" withString:@""];
  resolve(base64url);
}

RCT_EXPORT_METHOD(sha256:(NSString *)input
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
  NSData *data = [input dataUsingEncoding:NSUTF8StringEncoding];
  uint8_t digest[CC_SHA256_DIGEST_LENGTH];
  CC_SHA256(data.bytes, (CC_LONG)data.length, digest);

  // Base64url encode
  NSData *hashData = [NSData dataWithBytes:digest length:CC_SHA256_DIGEST_LENGTH];
  NSString *base64 = [hashData base64EncodedStringWithOptions:0];
  NSString *base64url = base64;
  base64url = [base64url stringByReplacingOccurrencesOfString:@"+" withString:@"-"];
  base64url = [base64url stringByReplacingOccurrencesOfString:@"/" withString:@"_"];
  base64url = [base64url stringByReplacingOccurrencesOfString:@"=" withString:@""];
  resolve(base64url);
}

#pragma mark - ASWebAuthenticationPresentationContextProviding

- (ASPresentationAnchor)presentationAnchorForWebAuthenticationSession:
    (ASWebAuthenticationSession *)session {
  return NSApp.keyWindow ?: NSApp.windows.firstObject;
}

@end
