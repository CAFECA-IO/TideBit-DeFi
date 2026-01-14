# TideBit-DeFi：RWA 募資平台架構設計 (鏈上為真)

## 1. 核心設計哲學：鏈上為真

* **無狀態後端**：資料庫僅作為「快取 (Cache)」以提升 UI 響應速度。所有關鍵邏輯判斷（如：是否有權限開案、是否通過 KYC）必須直接查詢智慧合約。
* **確定性地址**：利用 `CREATE2` 技術，用戶與公司的智慧錢包地址僅取決於其原始參數（如公鑰、Salt），不依賴資料庫儲存的 ID。
* **身分還原**：透過掃描 `IdentityRegistry` 與 `SCWFactory` 的 Event Logs，系統可在無 DB 環境下重建所有用戶與公司的關聯圖譜。

---

## 2. 數位身分與錢包體系

### 2.1 PersonalSCW (個人數位身分)

* **定義**：每個用戶僅擁有一個唯一的 `PersonalSCW`。它是用戶在 Web3 世界的 **數位身分載體**。
* **身分綁定**：錢包地址與 `Identity` 合約 (ONCHAINID) 的映射關係儲存在鏈上的 `IdentityRegistry` 中。
* **資產權限**：持有的 NTD 與公司股權受到其關聯 `Identity` 合約內 `Claim` (憑證) 的即時約束。

### 2.2 CompanySCW (公司法人錢包)

* **定義**：每間公司擁有一個獨立的 `CompanySCW`。
* **多成員治理**：成員名單、角色、權重與簽名門檻 (Threshold) 全部紀錄在 `CompanySCW` 合約狀態中。
* **資產權限**：持有 NTD 平台幣。其發起募資與管理資金的權力取決於該公司的 **KYB** 狀態。

---

## 3. MVP 核心流程：端到端實作路徑

### 第一階段：用戶入網與錢包確定

1. **Passkey 註冊**：用戶產生 WebAuthn 密鑰對。
2. **地址計算**：系統根據公鑰  與  透過 `SCWFactory` 計算出預測地址。
3. **鏈上還原點**：只要用戶持有同一組 Passkey，隨時可重新計算出同一個 `PersonalSCW` 地址，無需 DB 記錄。

### 第二階段：管理員核准 KYC / KYB (身分上鏈)

1. **身分核准 API (`/api/v1/kyc/approve`)**：
* **不再依賴 DB 狀態**：API 接收 `address` 與 `type` (USER/COMPANY)。
* **鏈上檢查**：先查詢 `IdentityRegistry` 是否已有記錄。
* **身分部署**：若無，則部署 `Identity` 合約。
* **憑證發放**：
* `USER`：發放 **Topic 101 (KYC)**。
* `COMPANY`：發放 **Topic 102 (KYB)**。


* ** Registry 註冊**：呼叫 `IdentityRegistry.registerIdentity`。


2. **結果**：身分狀態永久存在於鏈上，任何合約或第三方皆可驗證。

### 第三階段：NTD 鑄幣與持有

1. **鑄幣請求**：當收到儲值訊號，Relayer 呼叫 NTD 合約 (ERC-3643)。
2. **鏈上合規檢查**：NTD 合約自動查詢 `IdentityRegistry`。若用戶地址已註冊且有 Topic 101 憑證，則 `mint` 成功。
3. **事實來源**：用戶餘額直接由 NTD 合約記錄，不依賴 DB 的餘額欄位。

### 第四階段：建立公司與成員管理

1. **公司部署**：Creator 透過 `SCWFactory` 部署 `CompanySCW`。
2. **權限鏈上化**：
* 成員的 `role` 與 `weight` 在部署時直接寫入合約。
* 後續成員變更（Add Member/Change Role）必須透過鏈上交易執行，並發送 Event Logs。


3. **無 DB 運作**：前端透過監聽 `CompanySCW` 的成員變更 Event，即可即時顯示當前公司的管理架構。

### 第五階段：募資計劃與資產交換

1. **認購**：用戶從 `PersonalSCW` 發送 NTD 到募資合約。
2. **鎖定 (Escrow)**：募資合約（鏈上）負責持有 NTD。
3. **成功結算**：
* 合約自動執行：NTD  `CompanySCW`；公司股權  `PersonalSCW`。
* **全鏈上檢查**：兩端的轉帳皆會觸發 ERC-3643 的 `IdentityRegistry` 檢查，確保交易雙方持續符合合規要求。



---

## 4. 資產存放事實表

| 資產類型 | PersonalSCW (個人) | CompanySCW (公司) | 鏈上檢查機制 |
| --- | --- | --- | --- |
| **NTD 平台幣** | ✅ 可持有 | ✅ 可持有 | `IdentityRegistry` (Topic 101/102) |
| **公司股權** | ✅ 可持有 | ❌ (僅作為發行方) | `IdentityRegistry` (Topic 101) |
| **數位身分 (ONCHAINID)** | ✅ 1:1 綁定 | ✅ 1:1 綁定 | `mapping(address => Identity)` |

