# 新增 Scheme/Build Variant 步驟指南

## 情境

假設你要新增第三個 App，例如 **Admin App**（管理者後台）

---

## Android 設定步驟

### 1. 建立環境變數檔案

建立 `.env.admin`：

```bash
# Admin App Configuration
APP_TYPE=admin
APP_NAME=bbAdmin
APP_DISPLAY_NAME=人體工房管理後台
API_URL=https://api.yoshinobu.com
```

### 2. 更新 build.gradle

編輯 `android/app/build.gradle`：

#### 2.1 加入環境變數檔案對應

```gradle
project.ext.envConfigFiles = [
    userDebug: ".env.user",
    userRelease: ".env.user",
    clientDebug: ".env.client",
    clientRelease: ".env.client",
    adminDebug: ".env.admin",      // 新增
    adminRelease: ".env.admin",    // 新增
]
```

#### 2.2 加入新的 Product Flavor

```gradle
productFlavors {
    user {
        dimension "app"
        applicationId "me.bbapp.yamamoto"
        resValue "string", "app_name", "人體工房"
    }

    client {
        dimension "app"
        applicationId "me.bbapp.yoshinobu"
        resValue "string", "app_name", "人體工房教練"
    }

    admin {                                  // 新增
        dimension "app"
        applicationId "me.bbapp.admin"
        resValue "string", "app_name", "人體工房管理後台"
    }
}
```

### 3. 建立 Flavor 專屬資源

建立資料夾結構：

```bash
mkdir -p android/app/src/admin/res/values
mkdir -p android/app/src/admin/res/mipmap-{hdpi,mdpi,xhdpi,xxhdpi,xxxhdpi}
```

建立 `android/app/src/admin/res/values/strings.xml`：

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">人體工房管理後台</string>
</resources>
```

### 4. 更新 package.json 腳本

```json
{
  "scripts": {
    "android:admin": "ENVFILE=.env.admin react-native run-android --mode=adminDebug --appId=me.bbapp.admin"
  }
}
```

### 5. 更新 TypeScript 型別

編輯 `src/types/env.d.ts`：

```typescript
export interface NativeConfig {
  APP_TYPE: 'user' | 'client' | 'admin';  // 加入 'admin'
  APP_NAME: string;
  APP_DISPLAY_NAME: string;
  API_URL: string;
}
```

### 6. Sync 並測試

在 Android Studio：
1. File → Sync Project with Gradle Files
2. Build Variants → 選擇 `adminDebug`
3. Run

或在終端：
```bash
npm run android:admin
```
---

## 快速指令參考

```bash
# 建立環境變數檔案
cat > .env.admin << EOF
APP_TYPE=admin
APP_NAME=bbAdmin
APP_DISPLAY_NAME=人體工房管理後台
API_URL=https://api.yoshinobu.com
EOF

# 建立 Android 資源
mkdir -p android/app/src/admin/res/values
cat > android/app/src/admin/res/values/strings.xml << EOF
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">人體工房管理後台</string>
</resources>
EOF