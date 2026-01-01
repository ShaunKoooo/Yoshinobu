# CodePush 發布指南

本文件說明如何使用 CodePush（透過 AppsOnAir）發布更新，並正確更新 `BUNDLE_BUILD` 版本號。

## 手動發布流程

請按照以下步驟手動發布：

### 步驟 1: 更新 BUNDLE_BUILD

編輯 `src/constants/version.ts`：

```typescript
/**
 * Code Push Bundle Build Number
 *
 * Increment this with each CodePush release.
 * This helps track the exact build within the same version.
 */
export const BUNDLE_BUILD = 1;  // 將數字改為新的版本號
```

### 步驟 2: 發布到 AppsOnAir

#### 發布到 spa

```bash
# iOS
appsonair-codepush release-react cofit-workspace-spa-ios --targetBinaryVersion 1.3 -t "20260101" -d "修復登入 bug" --mandatory

# Android
appsonair-codepush release-react cofit-workspace-spa-android --targetBinaryVersion 1.3 -t "20260101" -d "修復登入 bug" --mandatory
```

#### 發布到 bb

```bash
# iOS
appsonair-codepush release-react cofit-workspace-bb-ios --targetBinaryVersion 1.3 -t "20260101" -d "修復登入 bug" --mandatory

# Android
appsonair-codepush release-react cofit-workspace-bb-android --targetBinaryVersion 1.3 -t "20260101" -d "修復登入 bug" --mandatory

```

### 步驟 3: 提交版本變更

```bash
git add src/constants/version.ts
git commit -m "chore: bump bundle build to 45"
git push
```
#### 參數說明

| 參數 | 必填 | 說明 | 範例 |
|------|------|------|------|
| `version` | ✅ | Bundle build 版本號 | `45`, `46` |
| `description` | ✅ | 更新說明 | `"修復登入 bug"` |
| `app` | ❌ | 目標 app（`spa` 或 `bb`），不指定則發布到全部 | `spa` |

---

## 版本號說明

### 用戶看到的版本資訊

用戶在 App 的個人資料頁面會看到：

```
版本: 1.0.0 (123) - Bundle: 20260101
```

各部分說明：

| 部分 | 來源 | 說明 | 何時改變 |
|------|------|------|----------|
| `1.0.0` | Native app version | App Store/Play Store 版本 | 發布新的 Native build |
| `(123)` | Build number | Native build 編號 | 每次 Native build |
| `Bundle: 45` | BUNDLE_BUILD | CodePush bundle 版本 | 每次 CodePush 更新 |

### 沒有 CodePush 更新時

```
版本: 1.0.0 (123)
```

只顯示 Native 版本資訊。

### BUNDLE_BUILD 命名規則

建議使用**遞增數字**作為 `BUNDLE_BUILD`：

```typescript
// 不推薦：使用語義化版本
export const BUNDLE_BUILD = '1.2.3';  ❌

// 推薦：使用遞增數字
export const BUNDLE_BUILD = 45;  ✅
export const BUNDLE_BUILD = 46;  ✅
export const BUNDLE_BUILD = 47;  ✅
```
---

## 常見問題

### Q1: 如果忘記更新 BUNDLE_BUILD 會怎樣？

**A:** 用戶看到的版本號不會改變，但 CodePush 仍然會更新程式碼。建議每次都更新以便追蹤。

### Q2: BUNDLE_BUILD 要跟 CodePush label 一樣嗎？

**A:** 建議一樣。使用 `-t` 參數指定 label 時，應該與 `BUNDLE_BUILD` 相同：

```bash
# BUNDLE_BUILD = 45
appsonair-codepush release-react spa-ios ios -t "45" -d "修復 bug"
```

這樣 CodePush metadata 和 bundle 內的版本號會一致。

### Q3: 多個 app 的 BUNDLE_BUILD 要分開管理嗎？

**A:** 不用！使用統一的 `BUNDLE_BUILD` 有以下好處：

- 簡化管理：一個版本號管理所有平台
- 容易追蹤：知道這次更新發布到哪些平台
- 避免混淆：不會搞不清楚哪個版本對應哪個更新

### Q4: 如何查看目前發布的版本？

```bash
# 查看 spa-ios 的發布歷史
code-push deployment ls spa-ios

# 查看詳細的部署歷史
code-push deployment history spa-ios Production
```

### Q6: 如何回滾到之前的版本？

```bash
# 回滾到上一個版本
code-push rollback spa-ios Production

# 或透過 deployment history 查看版本後回滾
code-push deployment history spa-ios Production
code-push rollback spa-ios Production --target-release v44
```

---