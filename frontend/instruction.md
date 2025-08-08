## RBAC 角色與權限設計

| 角色          | 權限說明                                                                                                                          |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| 使用者(User)  | - 使用前台地圖與搜尋功能<br>- 新增景點申請（需管理者審核）                                                                        |
| 管理者(Admin) | - 審核使用者新增的景點<br>- 使用者管理（新增、刪除、權限設定）<br>- 景點管理（編輯、刪除、批次操作）<br>- 查看 Dashboard 統計數據 |

## 權限細節 (Permission)

| 資源          | 操作           | 描述                   |
| ------------- | -------------- | ---------------------- |
| 景點 (Site)   | create         | 新增景點申請           |
| 景點 (Site)   | review/approve | 審核並通過新增景點     |
| 景點 (Site)   | update         | 編輯景點資料           |
| 景點 (Site)   | delete         | 刪除景點               |
| 使用者 (User) | read           | 查看使用者列表         |
| 使用者 (User) | create         | 新增使用者（管理者用） |
| 使用者 (User) | update         | 編輯使用者資料         |
| 使用者 (User) | delete         | 刪除使用者             |
| Dashboard     | read           | 查看儀表板統計數據     |

## 後台主要頁面

| 頁面名稱          | 功能說明                                                 |
| ----------------- | -------------------------------------------------------- |
| Dashboard         | 統計數據（使用者數量、景點數量、待審核景點、活動紀錄等） |
| User Management   | 使用者列表、角色與權限設定、搜尋、封鎖/啟用帳號          |
| Site Management   | 景點管理（審核待審核的景點、編輯/刪除已發布景點）        |
| Site Submission   | 使用者新增的景點申請列表，供管理者審核                   |
| Role & Permission | 角色權限細節管理（可選，若想支援更動態的權限設定）       |
| Activity Log      | 管理者操作紀錄（誰審核了什麼、誰修改了什麼）             |
| Settings          | 後台系統設定，如多語系、通知、API Key 管理等             |

## 前台功能建議

| 功能            | 說明                               |
| --------------- | ---------------------------------- |
| 地圖展示        | 用 Leaflet 展示台灣景點位置        |
| 主題搜尋        | 依動畫、電影等主題搜尋景點         |
| 景點詳情頁      | 顯示景點照片、介紹、地址、評論等   |
| 使用者登入/註冊 | （可選）讓使用者登入、申請新增景點 |
| 新增景點申請    | 表單介面，讓使用者提交新增景點申請 |

## 目錄結構

frontend/
├── public/
│ ├── locales/
│ ├── index.html
├── src/
│ ├── components/ # React 元件 (.tsx)
│ ├── hooks/ # 自訂 Hooks (.ts)
│ ├── pages/ # 各頁面元件 (.tsx)
│ ├── services/ # API 呼叫封裝 (.ts)
│ ├── types/ # TypeScript 類型定義 (.ts)
│ ├── i18n.ts # 多語系初始化設定
│ ├── App.tsx # 入口元件
│ ├── index.tsx # React DOM render
│ └── ...
├── package.json
├── tsconfig.json # TypeScript 設定檔
└── README.md

## 技術棧

React.js (Functional Components + Hooks)

React Router（頁面路由）

react-i18next（多語系管理）

Leaflet.js + OpenStreetMap（地圖繪製與操作）

axios / fetch（API 請求）

CSS Modules / Styled Components（樣式管理）

GitHub Pages（靜態網站托管）

GitHub Actions（CI/CD 自動部署）

Typescript

## 主要功能

1. 主頁地圖展示
   使用 Leaflet.js 顯示地圖與標記

根據使用者搜尋條件（主題分類）載入與顯示相關景點

景點點擊顯示詳情（照片、描述、地理位置）

2. 主題搜尋
   支援關鍵字搜尋與多主題篩選

API 呼叫後端景點搜尋接口，動態更新地圖標記

3. 多語系切換
   支援繁體中文與英文切換

使用 react-i18next 管理文字資源，語言檔存於 public/locales/

提供語言切換按鈕，存取使用者選擇語言

4. 後台管理入口（需登入，JWT Token）
   使用者登入後可進入後台頁面（如新增地點、管理使用者等）

Token 存於 localStorage，API 請求附帶 Authorization header

## 多語系管理 (i18n)

使用 react-i18next 初始化設定於 src/i18n.js

語系 JSON 檔案置於 public/locales/{lang}/translation.json

文字使用 t('key') 取得對應語系文字

根據瀏覽器預設語言或使用者切換更新語言狀態

確保所有 UI 文字皆支援多語系

## API 服務呼叫

使用 axios 封裝於 src/services/api.ts

所有對後端的 RESTful API 請求皆從此調用

支援自動帶入 JWT Token（若登入）

錯誤處理（如 Token 過期跳轉登入）

## 開發與部署

### 本地開發

npm install

npm start 啟動本地開發伺服器，支援熱更新

本地測試前端功能與與後端 API 聯動

### 編譯與部署

npm run build 產生靜態檔案 (build/ 目錄)

靜態檔案部署至 GitHub Pages

GitHub Actions 監控 release 分支自動編譯並部署
