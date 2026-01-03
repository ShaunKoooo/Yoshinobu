# Xcode Schemes 設定

## 目標設定

- spa scheme → Bundle ID: `me.spaapp.yamamoto` → 顯示名稱：人體工房
- bb scheme → Bundle ID: `me.bbapp.yoshinobu` → 顯示名稱：Buddy_Body

---

## 步驟 1: 建立 Schemes

1. 打開 Xcode: `cd ios && open Yoshinobu.xcworkspace`
2. 上方工具列點擊 Scheme 選擇器 → **"Manage Schemes..."**
3. 點擊 **"+"** 建立新 Scheme：
   - Target: 選擇 `spa`
   - Name: `spa`
   - 勾選 **Shared**
4. 再點 **"+"** 建立第二個：
   - Target: 選擇 `bb`
   - Name: `bb`
   - 勾選 **Shared**
5. 點擊 **"Close"**

---

## 步驟 2: 設定 Targets

### spa Target

1. 選擇 **spa** target
2. **Build Settings** → 搜尋 **"Info.plist File"**
   - 設定為：`spa_Info.plist`
3. 搜尋 **"Product Bundle Identifier"**
   - 設定為：`me.spaapp.yamamoto`

### bb Target

1. 選擇 **bb** target
2. **Build Settings** → 搜尋 **"Info.plist File"**
   - 設定為：`bb_Info.plist`
3. 搜尋 **"Product Bundle Identifier"**
   - 設定為：`me.bbapp.yoshinobu`

---

## 步驟 3: 設定 Pre-actions -> 讓 xcode build 直接去找 .env 檔 

```Pre-action 就是在編譯前自動指定該用哪個 .env 環境檔,這樣不同的 scheme 就能自動載入對應的設定(例如不同的 API endpoints、app 名稱等),不需要手動切換環境變數檔案。```

### spa Scheme

1. 選擇 spa scheme → **"Edit Scheme..."** (⌘<)
2. 左側選擇 **"Build"** → 展開 **"Pre-actions"**
3. 點擊 **"+"** → **"New Run Script Action"**
4. **Provide build settings from:** 選擇 `spa`
5. Script:
   ```bash
   echo ".env.spa" > /tmp/envfile
   ```
6. 點擊 **"Close"**

### bb Scheme

1. 選擇 bb scheme → **"Edit Scheme..."**
2. 左側選擇 **"Build"** → 展開 **"Pre-actions"**
3. 點擊 **"+"** → **"New Run Script Action"**
4. **Provide build settings from:** 選擇 `bb`
5. Script:
   ```bash
   echo ".env.bb" > /tmp/envfile
   ```
6. 點擊 **"Close"**

---

## 步驟 4: 設定簽名

### spa

1. 選擇 spa target → **Signing & Capabilities**
2. 勾選 **"Automatically manage signing"**
3. 選擇 **Team**

### bb

1. 選擇 bb target → **Signing & Capabilities**
2. 勾選 **"Automatically manage signing"**
3. 選擇 **Team**

---

## 完成！

現在可以：
1. 選擇 spa scheme → Run → 啟動 spa App
2. 選擇 bb scheme → Run → 啟動 bb App

---

## 檢查清單

- [ ] 兩個 Schemes 已建立 (spa, bb)
- [ ] spa Info.plist 設定為 `spa_Info.plist`
- [ ] bb Info.plist 設定為 `bb_Info.plist`
- [ ] spa Bundle ID 是 `me.spaapp.yamamoto`
- [ ] bb Bundle ID 是 `me.bbapp.yoshinobu`
- [ ] spa Pre-action 設定完成
- [ ] bb Pre-action 設定完成
- [ ] 兩個 targets 都設定了 Signing
