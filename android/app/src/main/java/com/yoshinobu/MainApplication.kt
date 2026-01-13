package com.yoshinobu

import android.app.Application
import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import android.os.Build
import android.util.Log
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.lugg.RNCConfig.RNCConfigPackage
import com.microsoft.codepush.react.CodePush

class MainApplication : Application(), ReactApplication {

  override val reactHost: ReactHost by lazy {
    getDefaultReactHost(
      context = applicationContext,
      packageList =
        PackageList(this).packages.apply {
          // Packages that cannot be autolinked yet can be added manually here, for example:
          // add(MyReactNativePackage())
          add(RNCConfigPackage())
          add(AppConfigPackage())
        },
      jsBundleFilePath = CodePush.getJSBundleFile()
    )
  }

  override fun onCreate() {
    super.onCreate()
    loadReactNative(this)

    // 創建 Notification Channel（Android 8.0+）
    createNotificationChannel()
  }

  private fun createNotificationChannel() {
    // Android 8.0 (API 26) 及以上需要創建通知渠道
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      val channelId = "default_channel"  // 這個 ID 後端 rpush 要用
      val channelName = "預約通知"
      val channelDescription = "接收課程預約、提醒等重要通知"

      val channel = NotificationChannel(
        channelId,
        channelName,
        NotificationManager.IMPORTANCE_HIGH  // 高重要性 - 會發出聲音並顯示
      ).apply {
        description = channelDescription
        enableLights(true)      // 啟用指示燈
        enableVibration(true)   // 啟用震動
        setShowBadge(true)      // 顯示角標
      }

      val notificationManager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
      notificationManager.createNotificationChannel(channel)

      Log.d("MainApplication", "✅ Notification channel created: $channelId")
    }
  }
}
