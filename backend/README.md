# Site Management Backend

A NestJS-based backend API for managing tourist sites and submissions with role-based access control.

## Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control (USER/ADMIN)
- **Site Management**: CRUD operations for tourist sites with approval workflow
- **Submission System**: Users can submit new sites for admin approval
- **Dashboard**: Admin dashboard with statistics and recent activity
- **API Documentation**: Swagger/OpenAPI documentation
- **Database**: PostgreSQL with Prisma ORM
- **Validation**: Request validation with class-validator
- **Error Handling**: Global exception filter with structured error responses

## Tech Stack

- **Framework**: NestJS (Node.js + TypeScript)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with Passport.js
- **Validation**: class-validator & class-transformer
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest

## API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration

### Users (Admin only)
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `POST /users` - Create user
- `PATCH /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Sites
- `GET /sites` - Get approved sites (public)
- `GET /sites/all` - Get all sites with status filter (admin)
- `GET /sites/:id` - Get site by ID
- `POST /sites` - Create site (user)
- `PATCH /sites/:id` - Update site (owner/admin)
- `PATCH /sites/:id/status` - Update site status (admin)
- `DELETE /sites/:id` - Delete site (owner/admin)

### Submissions
- `GET /submissions` - Get all submissions (admin)
- `GET /submissions/pending` - Get pending submissions (admin)
- `GET /submissions/my` - Get user's submissions
- `GET /submissions/:id` - Get submission by ID
- `POST /submissions` - Create submission (user)
- `PATCH /submissions/:id` - Review submission (admin)
- `DELETE /submissions/:id` - Delete submission (owner/admin)

### Dashboard (Admin only)
- `GET /dashboard/stats` - Get statistics
- `GET /dashboard/activity` - Get recent activity

### Health
- `GET /` - Health check
- `GET /health` - Health status

## Setup

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/site_management?schema=public"
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="1h"
PORT=3000
NODE_ENV="development"
CORS_ORIGIN="http://localhost:3000,https://yourdomain.github.io"
```

4. Set up the database:
```bash
# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate
```

5. Start the development server:
```bash
npm run start:dev
```

The API will be available at `http://localhost:3000`
Swagger documentation will be available at `http://localhost:3000/api`

## Database Schema

### User
- `id`: Primary key
- `email`: Unique email address
- `password`: Hashed password
- `role`: USER or ADMIN
- `createdAt`, `updatedAt`: Timestamps

### Site
- `id`: Primary key
- `name`: Site name
- `description`: Site description
- `location`: GeoJSON location data
- `status`: PENDING, APPROVED, or REJECTED
- `createdById`: Foreign key to User
- `createdAt`, `updatedAt`: Timestamps

### Submission
- `id`: Primary key
- `siteData`: JSON data for the submitted site
- `status`: PENDING, APPROVED, or REJECTED
- `submittedById`: Foreign key to User (submitter)
- `reviewedById`: Foreign key to User (reviewer)
- `reviewedAt`: Review timestamp
- `createdAt`: Submission timestamp

## Scripts

- `npm run start` - Start production server
- `npm run start:dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:cov` - Run tests with coverage
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio

## API Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "errorCode": "ERROR_CODE",
  "message": "Error description",
  "stack": "Error stack trace (development only)"
}
```

## Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Role-Based Access Control

- **USER**: Can create sites, submit for approval, view own submissions
- **ADMIN**: Full access to all endpoints, can review submissions, manage users

## Testing

Run the test suite:

```bash
# Unit tests
npm run test

# Test coverage
npm run test:cov

# E2E tests
npm run test:e2e
```

## Deployment

The application is configured for deployment on Render or similar platforms. Make sure to:

1. Set environment variables in your deployment platform
2. Run database migrations: `npm run prisma:deploy`
3. Build the application: `npm run build`
4. Start with: `npm run start:prod`

## License

This project is licensed under the UNLICENSED license.