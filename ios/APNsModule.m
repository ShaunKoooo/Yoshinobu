#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(APNsModule, NSObject)

RCT_EXTERN_METHOD(getAPNSToken:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

@end
