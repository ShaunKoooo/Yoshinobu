package com.yoshinobu

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.module.annotations.ReactModule

@ReactModule(name = AppConfigModule.NAME)
class AppConfigModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = NAME

    override fun getConstants(): Map<String, Any> {
        val constants: MutableMap<String, Any> = HashMap()

        // 從 BuildConfig 讀取環境變數
        constants["APP_TYPE"] = BuildConfig.APP_TYPE
        constants["APP_NAME"] = BuildConfig.APP_NAME
        constants["APP_DISPLAY_NAME"] = BuildConfig.APP_DISPLAY_NAME
        constants["API_URL"] = BuildConfig.API_URL

        return constants
    }

    companion object {
        const val NAME = "AppConfig"
    }
}
