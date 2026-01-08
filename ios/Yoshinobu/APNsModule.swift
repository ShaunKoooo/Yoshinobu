import Foundation
import React

@objc(APNsModule)
class APNsModule: NSObject {

  @objc
  func getAPNSToken(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    // Try to get token from UserDefaults
    if let token = UserDefaults.standard.string(forKey: "APNsDeviceToken") {
      print("📱 APNsModule: Returning token from UserDefaults: \(token)")
      resolve(token)
    } else {
      print("⚠️ APNsModule: No token found in UserDefaults")
      resolve(nil)
    }
  }

  @objc
  static func requiresMainQueueSetup() -> Bool {
    return false
  }
}
