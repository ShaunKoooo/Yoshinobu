# 最終 App 架構

## 🎯 App 結構

### 兩個獨立的 App

| App | Bundle ID | 顯示名稱 | APP_TYPE |
|-----|-----------|----------|----------|
| **SPA App** | me.spaapp.yamamoto | SPA 人體工房 | `spa` |
| **BB App** | me.bbapp.yoshinobu | BB 按摩 | `bb` |

### 每個 App 內部的角色

登入後根據使用者權限切換：
- **學員** (User) - 一般使用者界面
- **教練** (Coach/Client) - 教練管理界面

---

## 🔄 切換方式

### Android

**Build Variants:**
- `spaDebug` / `spaRelease` → SPA App
- `bbDebug` / `bbRelease` → BB App

**終端指令:**
```bash
npm run android:spa    # SPA App
npm run android:bb     # BB App
```

**Android Studio:**
1. View → Tool Windows → Build Variants
2. 選擇 `spaDebug` 或 `bbDebug`
3. Clean + Rebuild
4. Run

### iOS

**Schemes:**
- `spa` → SPA App
- `bb` → BB App

**終端指令:**
```bash
npm run ios:spa    # SPA App
npm run ios:bb     # BB App
```

**Xcode:**
1. 選擇 Scheme (spa 或 bb)
2. Run (⌘R)

---

## 📂 專案結構

### 環境變數檔案

```
.env           # 預設 (SPA)
.env.spa       # SPA App 配置
.env.bb        # BB App 配置
```

### Android 資源

```
android/app/src/
├── main/      # 共用
├── spa/       # SPA App 專屬
│   └── res/
│       └── values/strings.xml
└── bb/        # BB App 專屬
    └── res/
        └── values/strings.xml
```

### iOS 資源

```
ios/
├── Yoshinobu/          # 共用程式碼
├── spa/                # SPA App 專屬
│   ├── Images.xcassets
│   └── LaunchScreen.storyboard
├── bb/                 # BB App 專屬
│   ├── Images.xcassets
│   └── LaunchScreen.storyboard
├── spa_Info.plist      # (需要從 bbUser_Info.plist 重新命名)
└── bb_Info.plist       # (需要從 bbClient_Info.plist 重新命名)
```

---

## 🎨 架構邏輯

### Scheme/Build Variant 層級（2個）

決定是哪個獨立的 App：
- SPA App
- BB App

### 登入後的角色層級（2個）

在 App 內部根據登入使用者的權限切換：
- 學員界面
- 教練界面

### 程式碼示例

```typescript
// src/navigation/RootNavigator.tsx
const appType = AppConfig.APP_TYPE; // 'spa' 或 'bb'

// 根據 appType 可以載入不同的 theme、API endpoint 等
if (appType === 'spa') {
  // SPA App 專屬設定
} else {
  // BB App 專屬設定
}

---

## ⚠️ iOS 還需要做的

你需要在 Xcode 中重新命名 targets 和 schemes：

### 1. 重新命名 Targets

- `bbUser` → `spa`
- `bbClient` → `bb`

### 2. 重新命名 Schemes

- `bbUser` → `spa`
- `bbClient` → `bb`

### 3. 重新命名 Info.plist

```bash
cd ios
mv bbUser_Info.plist spa_Info.plist
mv bbClient_Info.plist bb_Info.plist
```

然後在 Xcode Build Settings 更新路徑。

### 4. 更新 Podfile

```ruby
# SPA App target
target 'spa' do
  shared_pods
end

# BB App target
target 'bb' do
  shared_pods
end
```

### 5. 更新 Pre-actions

- spa scheme → `echo ".env.spa" > /tmp/envfile`
- bb scheme → `echo ".env.bb" > /tmp/envfile`

---

## ✅ 完成後

你將有：
- ✅ 2 個獨立的 App（可分別上架）
- ✅ 每個 App 內部可切換學員/教練（登入後）
- ✅ 共用大部分程式碼
- ✅ 輕鬆在開發時切換

---

## 📱 最終結果

```
┌─────────────────────────────────────┐
│ SPA App (me.spaapp.yamamoto)       │
│ 顯示名稱：SPA 人體工房                │
├─────────────────────────────────────┤
│ 登入後：                             │
│ ├─ 學員界面                          │
│ └─ 教練界面                          │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ BB App (me.bbapp.yoshinobu)        │
│ 顯示名稱：人體工房                    │
├─────────────────────────────────────┤
│ 登入後：                             │
│ ├─ 學員界面                          │
│ └─ 教練界面                          │
└─────────────────────────────────────┘
```

兩個 App 可以同時安裝在同一台裝置！
