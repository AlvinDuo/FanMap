# Fan Map (追星用景點地圖)

## 專案介紹

本專案為台灣景點主題搜尋地圖網站，使用者可依動畫、電影等主題搜尋相關取景地點。採用前後端分離架構：

- **前端**：React.js，部署於 GitHub Pages
- **後端**：Node.js + NestJS，部署於 Render，提供 RESTful API 並使用 Swagger 撰寫 API 文件
- **資料庫**：PostgreSQL，存放景點與主題資料
- **國際化 (i18n)**：前後端均支援多語系切換
- **認證機制**：僅限後台管理者登入使用 JWT Token 進行身份驗證，前端公開搜尋功能無需登入

---

## 架構圖

使用者瀏覽器
↓ (HTTP/HTTPS)
GitHub Pages (React 前端 SPA)
↓ (RESTful API, CORS)
Render Node.js 後端 API
↓
PostgreSQL 資料庫

---

## 技術細節

### 前端

- 使用 React.js 建置單頁應用 (SPA)
- 多語系支援 (i18n)，使用例如 `react-i18next` 等套件管理
- 透過 fetch / axios 呼叫後端 API，需注意跨域設定（CORS）
- 部署於 GitHub Pages，使用 GitHub Actions 自動部署
- Leaflet.js + OpenStreetMap

### 後端

- 使用 Node.js + NestJS 建立 RESTful API
- API 文件使用 Swagger (OpenAPI 3.0) 撰寫並自動產生，並支援多語系（i18n）
- 提供景點資料 CRUD、主題搜尋、使用者身份驗證（限少數管理者新增商家）
- 連接 PostgreSQL 資料庫，使用 Prisma
- 部署於 Render，並使用 GitHub Actions 進行 CI/CD 自動部署
- 設定 CORS，允許前端域名存取 API

### 資料庫

- Supabase
- PostgreSQL，包含 PostGIS 地理空間擴充
- 存放景點資料、主題分類、管理者帳號等資料表
- 可透過 SQL 腳本或 ORM Migration 管理資料結構

---

## CI/CD 流程

### 前端（GitHub Pages）

- 使用 GitHub Actions 監控 `main` 分支
- 自動執行：安裝套件、編譯 React 專案、部署至 GitHub Pages

### 後端（Render）

- 連結 GitHub Repo
- Push 程式碼至 `main` 分支自動觸發 Render Build & Deploy
- 可搭配 GitHub Actions 進行測試、Code Lint 等前置工作

---

## i18n 多語系說明

- 前端使用 `react-i18next`，可在 `public/locales` 下放置多語系 JSON 檔
- 後端 Swagger 文件使用 OpenAPI i18n 擴充套件（如 `swagger-ui-express` + `i18n`）實現多語言文件展示
- 介面與 API 文件均支援繁體中文、英文，方便多語言用戶使用

---

## 目錄結構範例

/
├── frontend/ # React 前端專案
│ ├── public/
│ │ └── locales/ # 多語系 JSON 檔
│ ├── src/
│ └── README.md
├── backend/ # Node.js 後端專案
│ ├── src/
│ ├── swagger/ # Swagger 文件與設定
│ ├── i18n/ # 後端多語系資源
│ └── README.md
├── docs/ # 專案相關文件
└── README.md # 總說明文件

---

## 環境變數設定範例

```env
# 後端
DATABASE_URL=postgresql://user:password@hostname:5432/dbname
JWT_SECRET=your_jwt_secret
CORS_ORIGIN=https://your-github-pages-domain.github.io
PORT=3000
```
