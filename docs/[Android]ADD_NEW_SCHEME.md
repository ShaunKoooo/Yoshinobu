# 新增 Scheme/Build Variant 步驟指南

## 情境

假設你要新增第三個 App，例如 **Beardy Leslie APP**（計算鬍子有幾根）

---

## Android 設定步驟

### 1. 建立環境變數檔案

建立 `.env.beardy`：

```bash
# Admin App Configuration
APP_TYPE=beardy
APP_NAME=beardyLei
APP_DISPLAY_NAME=鬍子雷叔里
API_URL=https://api.beardyleslie.com
```

### 2. 更新 build.gradle

編輯 `android/app/build.gradle`：

#### 2.1 加入環境變數檔案對應

```gradle
project.ext.envConfigFiles = [
    spaDebug: ".env.spa",
    spaRelease: ".env.spa",
    bbDebug: ".env.bb",
    bbRelease: ".env.bb",
    beardyDebug: ".env.beardy",      // 新增
    beardyRelease: ".env.beardy",    // 新增
]
```

#### 2.2 加入新的 Product Flavor (名稱對應 App_Type)

```gradle
productFlavors {
    spa {
        dimension "app"
        applicationId "me.spaapp.yamamoto"
        resValue "string", "app_name", "SPA"
    }

    bb {
        dimension "app"
        applicationId "me.bbapp.yoshinobu"
        resValue "string", "app_name", "BB"
    }

    beardy {                                  // 新增
        dimension "app"
        applicationId "me.beardy.lei"
        resValue "string", "app_name", "beardyLei"
    }
}
```

### 3. 建立 Flavor 專屬資源

建立資料夾結構：

```bash
mkdir -p android/app/src/beardy/res/values
mkdir -p android/app/src/beardy/res/mipmap-{hdpi,mdpi,xhdpi,xxhdpi,xxxhdpi}
```

建立 `android/app/src/beardy/res/values/strings.xml`：

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">鬍子雷叔里</string>
</resources>
```

### 4. 更新 package.json 腳本

```json
{
  "scripts": {
    "android:beardy": "ENVFILE=.env.beardy react-native run-android --mode=adminDebug --appId=me.beardy.lei"
  }
}
```

### 5. 更新 TypeScript 型別

編輯 `src/types/env.d.ts`：

```typescript
export interface NativeConfig {
  APP_TYPE: 'spa' | 'bb' | 'beardy';  // 加入 'admin'
  APP_NAME: string;
  APP_DISPLAY_NAME: string;
  API_URL: string;
}
```

### 6. Sync 並測試

在 Android Studio：
1. File → Sync Project with Gradle Files
2. Build Variants → 選擇 `beardyDebug`
3. Run

或在終端：
```bash
npm run android:beardy
```
---