# 景點管理系統後端設置指南

## 🎯 項目概述

這是一個基於 NestJS 的景點管理系統後端，實現了完整的 RBAC 權限控制、JWT 認證、景點管理和申請審核功能。

## 📁 項目結構

```
backend/
├── src/
│   ├── modules/
│   │   ├── auth/           # 認證模組 (JWT, 登入註冊)
│   │   ├── users/          # 使用者管理模組
│   │   ├── sites/          # 景點管理模組
│   │   ├── submissions/    # 景點申請模組
│   │   └── dashboard/      # 儀表板統計模組
│   ├── common/
│   │   ├── guards/         # 權限守衛
│   │   ├── decorators/     # 自訂裝飾器
│   │   ├── filters/        # 異常過濾器
│   │   └── interfaces/     # 介面定義
│   ├── prisma/             # Prisma 服務
│   ├── main.ts             # 應用程式入口
│   └── app.module.ts       # 主模組
├── prisma/
│   └── schema.prisma       # 資料庫 Schema
├── .env.example            # 環境變數範例
└── README.md
```

## 🚀 快速開始

### 1. 安裝依賴
```bash
npm install
```

### 2. 設置環境變數
```bash
cp .env.example .env
```

編輯 `.env` 文件：
```env
DATABASE_URL="postgresql://username:password@localhost:5432/site_management?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="1h"
PORT=3000
NODE_ENV="development"
CORS_ORIGIN="http://localhost:3000,https://yourdomain.github.io"
```

### 3. 設置資料庫
```bash
# 生成 Prisma 客戶端
npm run prisma:generate

# 執行資料庫遷移
npm run prisma:migrate
```

### 4. 啟動開發服務器
```bash
npm run start:dev
```

## 📊 資料庫設計

### User (使用者)
- `id`: 主鍵
- `email`: 唯一郵箱
- `password`: 加密密碼
- `role`: 角色 (USER/ADMIN)

### Site (景點)
- `id`: 主鍵
- `name`: 景點名稱
- `description`: 景點描述
- `location`: GeoJSON 位置資料
- `status`: 狀態 (PENDING/APPROVED/REJECTED)
- `createdById`: 創建者 ID

### Submission (申請)
- `id`: 主鍵
- `siteData`: 申請的景點資料 (JSON)
- `status`: 申請狀態
- `submittedById`: 申請者 ID
- `reviewedById`: 審核者 ID

## 🔐 權限設計

### 角色權限
- **USER**: 可以創建景點、提交申請、查看自己的申請
- **ADMIN**: 擁有所有權限，可以審核申請、管理使用者

### API 權限控制
- 使用 `@Roles()` 裝飾器標記需要的角色
- `JwtAuthGuard` 驗證 JWT Token
- `RolesGuard` 檢查使用者角色權限

## 📡 主要 API 端點

### 認證
- `POST /auth/login` - 使用者登入
- `POST /auth/register` - 使用者註冊

### 景點管理
- `GET /sites` - 取得已審核通過的景點 (公開)
- `POST /sites` - 創建景點 (需登入)
- `PATCH /sites/:id/status` - 更新景點狀態 (僅管理員)

### 申請管理
- `POST /submissions` - 提交景點申請 (需登入)
- `GET /submissions` - 查看所有申請 (僅管理員)
- `PATCH /submissions/:id` - 審核申請 (僅管理員)

### 使用者管理
- `GET /users` - 取得使用者列表 (僅管理員)
- `POST /users` - 創建使用者 (僅管理員)

### 儀表板
- `GET /dashboard/stats` - 取得統計資料 (僅管理員)
- `GET /dashboard/activity` - 取得最近活動 (僅管理員)

## 🛠 技術特色

### 1. 統一 API 回應格式
```json
{
  "success": true,
  "message": "操作成功",
  "data": { ... }
}
```

### 2. 全域異常處理
- 自動捕獲並格式化錯誤回應
- 開發環境顯示錯誤堆疊
- 結構化日誌輸出

### 3. 請求驗證
- 使用 `class-validator` 進行 DTO 驗證
- 自動轉換和清理輸入資料

### 4. Swagger 文檔
- 自動生成 API 文檔
- 訪問 `http://localhost:3000/api`

## 🧪 測試

```bash
# 單元測試
npm run test

# 測試覆蓋率
npm run test:cov

# E2E 測試
npm run test:e2e
```

## 📦 部署

### 生產環境構建
```bash
npm run build
npm run start:prod
```

### 環境變數設置
確保在生產環境中設置：
- `DATABASE_URL`: 生產資料庫連接
- `JWT_SECRET`: 強密碼 JWT 密鑰
- `NODE_ENV=production`
- `CORS_ORIGIN`: 允許的前端域名

## 🔧 開發工具

- **ESLint**: 代碼檢查
- **Prettier**: 代碼格式化
- **Prisma Studio**: 資料庫管理界面
- **Jest**: 測試框架

## 📝 下一步

1. 設置資料庫連接
2. 運行遷移創建表結構
3. 創建管理員帳戶
4. 測試 API 端點
5. 部署到生產環境

## 🎉 完成狀態

✅ **已完成功能**：
- JWT 認證系統
- RBAC 權限控制
- 景點 CRUD 操作
- 申請審核流程
- 使用者管理
- 儀表板統計
- API 文檔
- 全域異常處理
- 請求驗證
- 基礎測試

🔄 **可擴展功能**：
- 檔案上傳 (景點圖片)
- 郵件通知
- 快取機制
- 日誌監控
- 多語系支援
- API 限流