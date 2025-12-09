# Xcode Schemes 設定

## 目標設定

- bbUser scheme → Bundle ID: `me.bbapp.yamamoto` → 顯示名稱：人體工房
- bbClient scheme → Bundle ID: `me.bbapp.yoshinobu` → 顯示名稱：人體工房教練

---

## 步驟 1: 建立 Schemes

1. 打開 Xcode: `cd ios && open Yoshinobu.xcworkspace`
2. 上方工具列點擊 Scheme 選擇器 → **"Manage Schemes..."**
3. 點擊 **"+"** 建立新 Scheme：
   - Target: 選擇 `bbUser`
   - Name: `bbUser`
   - 勾選 **Shared**
4. 再點 **"+"** 建立第二個：
   - Target: 選擇 `bbClient`
   - Name: `bbClient`
   - 勾選 **Shared**
5. 點擊 **"Close"**

---

## 步驟 2: 設定 Targets

### bbUser Target

1. 選擇 **bbUser** target
2. **Build Settings** → 搜尋 **"Info.plist File"**
   - 設定為：`bbUser_Info.plist`
3. 搜尋 **"Product Bundle Identifier"**
   - 設定為：`me.bbapp.yamamoto`

### bbClient Target

1. 選擇 **bbClient** target
2. **Build Settings** → 搜尋 **"Info.plist File"**
   - 設定為：`bbClient_Info.plist`
3. 搜尋 **"Product Bundle Identifier"**
   - 設定為：`me.bbapp.yoshinobu`

---

## 步驟 3: 設定 Pre-actions -> 讓 xcode build 直接去找 .env 檔 

### bbUser Scheme

1. 選擇 bbUser scheme → **"Edit Scheme..."** (⌘<)
2. 左側選擇 **"Build"** → 展開 **"Pre-actions"**
3. 點擊 **"+"** → **"New Run Script Action"**
4. **Provide build settings from:** 選擇 `bbUser`
5. Script:
   ```bash
   echo ".env.user" > /tmp/envfile
   ```
6. 點擊 **"Close"**

### bbClient Scheme

1. 選擇 bbClient scheme → **"Edit Scheme..."**
2. 左側選擇 **"Build"** → 展開 **"Pre-actions"**
3. 點擊 **"+"** → **"New Run Script Action"**
4. **Provide build settings from:** 選擇 `bbClient`
5. Script:
   ```bash
   echo ".env.client" > /tmp/envfile
   ```
6. 點擊 **"Close"**

---

## 步驟 4: 設定簽名

### bbUser

1. 選擇 bbUser target → **Signing & Capabilities**
2. 勾選 **"Automatically manage signing"**
3. 選擇 **Team**

### bbClient

1. 選擇 bbClient target → **Signing & Capabilities**
2. 勾選 **"Automatically manage signing"**
3. 選擇 **Team**

---

## 完成！

現在可以：
1. 選擇 bbUser scheme → Run → 啟動 User App
2. 選擇 bbClient scheme → Run → 啟動 Client App

---

## 檢查清單

- [ ] 兩個 Schemes 已建立 (bbUser, bbClient)
- [ ] bbUser Info.plist 設定為 `bbUser_Info.plist`
- [ ] bbClient Info.plist 設定為 `bbClient_Info.plist`
- [ ] bbUser Bundle ID 是 `me.bbapp.yamamoto`
- [ ] bbClient Bundle ID 是 `me.bbapp.yoshinobu`
- [ ] bbUser Pre-action 設定完成
- [ ] bbClient Pre-action 設定完成
- [ ] 兩個 targets 都設定了 Signing
