## 專案架構

backend/
├── src/
│ ├── modules/
│ │ ├── auth/ # 認證與授權模組（JWT, RBAC）
│ │ ├── users/ # 使用者管理模組
│ │ ├── sites/ # 景點管理模組
│ │ ├── submissions/ # 景點新增申請模組
│ │ ├── dashboard/ # 儀表板統計模組
│ ├── common/
│ │ ├── guards/ # 權限守衛（Guards）
│ │ ├── decorators/ # 自訂 Decorators (如 @Roles)
│ │ ├── interceptors/
│ │ ├── filters/
│ ├── main.ts # 程式入口
│ └── app.module.ts # 主模組
├── prisma/
│ ├── schema.prisma # Prisma schema
│ └── migrations/
├── swagger/ # Swagger 文件設定
├── i18n/ # 後端多語系設定
├── .env # 環境變數
└── README.md

## 技術棧

Node.js + NestJS 框架 (TypeScript)

Supabase Prisma ORM 操作 PostgreSQL (含 PostGIS)

JWT JSON Web Token 驗證

Swagger (OpenAPI) 自動文件

i18n 多語系支援 (nestjs-i18n)

RBAC 角色權限管理 (NestJS Guards + 自訂 Decorators)

測試框架：Jest (單元測試)

部署於 Render

## 資料庫設計

model User {
id Int @id @default(autoincrement())
email String @unique
password String
role Role @default(USER)
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
sites Site[] @relation("UserSites")
submissions Submission[]
}

enum Role {
USER
ADMIN
}

model Site {
id Int @id @default(autoincrement())
name String
description String
location Json // GeoJSON 或 PostGIS geography 類型
status SiteStatus @default(PENDING)
createdBy User @relation(fields: [createdById], references: [id])
createdById Int
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
}

enum SiteStatus {
PENDING
APPROVED
REJECTED
}

model Submission {
id Int @id @default(autoincrement())
siteData Json // 新增景點申請資料
status SubmissionStatus @default(PENDING)
submittedBy User @relation(fields: [submittedById], references: [id])
submittedById Int
reviewedBy User? @relation(fields: [reviewedById], references: [id])
reviewedById Int?
reviewedAt DateTime?
createdAt DateTime @default(now())
}

enum SubmissionStatus {
PENDING
APPROVED
REJECTED
}

## 主要 API 規範 (示例)

| 路由                     | 方法   | 功能                 | 權限  |
| ------------------------ | ------ | -------------------- | ----- |
| `POST /auth/login`       | POST   | 使用者登入，取得 JWT | 公開  |
| `GET /users`             | GET    | 取得使用者列表       | Admin |
| `POST /sites`            | POST   | 使用者新增景點申請   | User  |
| `GET /sites`             | GET    | 查詢已審核通過的景點 | 公開  |
| `GET /submissions`       | GET    | 管理者查看待審核申請 | Admin |
| `PATCH /submissions/:id` | PATCH  | 審核景點申請         | Admin |
| `DELETE /sites/:id`      | DELETE | 管理者刪除景點       | Admin |
| `GET /dashboard/stats`   | GET    | 儀表板統計資料       | Admin |

## 權限控管設計

使用 NestJS Guards 實作 RolesGuard

自訂 @Roles() Decorator 標記 Controller 或 Route

從 JWT Token 解析使用者角色

管控路由存取權限

## 認證機制

登入時使用者輸入帳密

後端驗證後簽發 JWT Token (包含使用者角色)

前端存放 Token，呼叫 API 時帶上 Authorization: Bearer <token>

後端驗證 Token 並取得角色資訊控制權限

## JWT Token 失效策略

Access Token 設合理過期時間（15分鐘到1小時）

Refresh Token 設較長過期時間（可由伺服器紀錄並註銷）

使用 Refresh Token 換取新的 Access Token

驗證 Token 簽章與有效期，避免偽造與過期

## 多語系

使用 nestjs-i18n 或類似套件

Controller、Exception Filter 會根據 Accept-Language Header 回傳多語系訊息

Swagger 文件支援多語系展示

## CI/CD

Render 連結 GitHub Repo，Push main 分支時自動建置與部署

GitHub Actions 用於 PR 測試、Lint 及品質管控

## 日誌與監控

後端輸出 JSON 結構化日誌

使用 Promtail 收集日誌，集中到 Loki

Grafana 監控並可設定告警

## 後端統一格式 (成功或失敗)

{ success , errorCode?, message ,data, stack? }）

### 錯誤格式統一

{
"success": false,
"errorCode": "ERR001",
"message": "錯誤描述訊息",
"stack": "呼叫堆疊資訊 (開發環境時開啟)"
}

自訂 Exception Filters 實作錯誤攔截與日誌

API 返回的錯誤範例與說明

## 密碼加密

使用 bcrypt 套件，設定 10~12 輪 salt

密碼不可逆且禁止明碼存儲

登入時用 bcrypt 比對密碼

## CORS 設定

僅允許信任的前端網域存取（如 GitHub Pages 網域）

在 NestJS 主程式或 Middleware 設定 CORS

## 測試策略

使用jest test ，每個service一定要有單元測試

## 快取機制

暫時不加入，後期可以加入
