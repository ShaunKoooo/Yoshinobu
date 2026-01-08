import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
import CodePush
import Firebase
import FirebaseCore
import FirebaseMessaging
import UserNotifications

@main
class AppDelegate: UIResponder, UIApplicationDelegate, UNUserNotificationCenterDelegate, MessagingDelegate {
  var window: UIWindow?

  var reactNativeDelegate: ReactNativeDelegate?
  var reactNativeFactory: RCTReactNativeFactory?

  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    // Configure Firebase
    FirebaseApp.configure()

    // Set up Push Notifications
    UNUserNotificationCenter.current().delegate = self
    Messaging.messaging().delegate = self

    // Request notification permissions
    UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .badge, .sound]) { granted, error in
      if granted {
        print("✅ Notification permission granted")
      }
    }

    application.registerForRemoteNotifications()
    print("📱 [AppDelegate] Registered for remote notifications")

    // Check if token already exists in UserDefaults
    if let existingToken = UserDefaults.standard.string(forKey: "APNsDeviceToken") {
      print("✅ [AppDelegate] Found existing APNs token in UserDefaults: \(existingToken)")
    } else {
      print("⚠️ [AppDelegate] No existing APNs token found in UserDefaults")
    }

    let delegate = ReactNativeDelegate()
    let factory = RCTReactNativeFactory(delegate: delegate)
    delegate.dependencyProvider = RCTAppDependencyProvider()

    reactNativeDelegate = delegate
    reactNativeFactory = factory

    window = UIWindow(frame: UIScreen.main.bounds)

    factory.startReactNative(
      withModuleName: "Yoshinobu",
      in: window,
      launchOptions: launchOptions
    )

    return true
  }

  // MARK: - Push Notification Handlers

  // 接收 FCM Token
  func messaging(_ messaging: Messaging, didReceiveRegistrationToken fcmToken: String?) {
    print("📱 Firebase registration token: \(String(describing: fcmToken))")
    // 可以將 token 發送到你的後端服務器
  }

  // 在前景收到通知
  func userNotificationCenter(_ center: UNUserNotificationCenter,
                              willPresent notification: UNNotification,
                              withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void) {
    print("📱 收到前景通知:", notification.request.content.userInfo)
    completionHandler([.banner, .sound, .badge])
  }

  // 用戶點擊通知
  func userNotificationCenter(_ center: UNUserNotificationCenter,
                              didReceive response: UNNotificationResponse,
                              withCompletionHandler completionHandler: @escaping () -> Void) {
    print("📱 用戶點擊通知:", response.notification.request.content.userInfo)
    completionHandler()
  }

  // MARK: - APNs Token Registration

  // 成功註冊 APNs，收到 Device Token
  func application(_ application: UIApplication,
                   didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
    print("🎯 [AppDelegate] didRegisterForRemoteNotificationsWithDeviceToken called!")
    print("🎯 [AppDelegate] Received device token, raw length: \(deviceToken.count) bytes")

    // 標準 APNs token 應該是 32 bytes = 64 hex chars
    // 如果收到更長的 token，只取前 32 bytes
    let standardTokenData: Data
    if deviceToken.count > 32 {
      standardTokenData = deviceToken.prefix(32)
      print("⚠️ APNs token was \(deviceToken.count) bytes, truncated to 32 bytes")
    } else {
      standardTokenData = deviceToken
      print("✅ APNs token is standard \(deviceToken.count) bytes")
    }

    // 將 Data 轉換為 hex 字串
    let token = standardTokenData.map { String(format: "%02.2hhx", $0) }.joined()
    print("📱 [AppDelegate] APNs Device Token: \(token)")
    print("📱 [AppDelegate] APNs Token Length: \(token.count)")

    // Save to UserDefaults for Native Module to access
    UserDefaults.standard.set(token, forKey: "APNsDeviceToken")
    UserDefaults.standard.synchronize()
    print("✅ [AppDelegate] Token saved to UserDefaults with key: APNsDeviceToken")

    // Verify it was saved
    if let savedToken = UserDefaults.standard.string(forKey: "APNsDeviceToken") {
      print("✅ [AppDelegate] Verified token in UserDefaults: \(savedToken)")
    } else {
      print("❌ [AppDelegate] Failed to verify token in UserDefaults!")
    }

    // 將標準長度的 APNs token 設置給 Firebase Messaging
    Messaging.messaging().apnsToken = standardTokenData
    print("✅ [AppDelegate] APNs token set to Firebase Messaging")
  }
  
  // 註冊 APNs 失敗
  func application(_ application: UIApplication,
                   didFailToRegisterForRemoteNotificationsWithError error: Error) {
    print("❌ Failed to register for remote notifications: \(error.localizedDescription)")
  }
}

class ReactNativeDelegate: RCTDefaultReactNativeFactoryDelegate {
  override func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }

override func bundleURL() -> URL? {
  #if DEBUG
    return RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
  #else
    return CodePush.bundleURL()
  #endif
}
}
