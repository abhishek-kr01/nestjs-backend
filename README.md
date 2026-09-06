# NestJS Backend

A hands-on NestJS backend project built incrementally to explore and implement common NestJS and backend concepts in one codebase.

The project covers REST APIs, validation, PostgreSQL with TypeORM, JWT authentication, role-based authorization, rate limiting, caching, pagination and filtering, file uploads with Cloudinary, events and listeners, interceptors, and middleware.

## What is implemented

### NestJS Fundamentals

The project uses NestJS modules to organize related functionality and follows the basic Controller → Service structure.

Implemented examples include:

- Modules
- Controllers
- Services
- Dependency Injection
- Shared/common functionality
- Application bootstrap configuration

---

## REST APIs

The project contains simple example modules as well as a database-backed `posts` API.

### Hello endpoints

```text
GET /hello
GET /hello/user/:name
GET /hello/query?name=Abhishek
```

### User example endpoints

```text
GET /user
GET /user/:id
GET /user/:id/welcome
```

These modules are simple examples used to demonstrate controllers, services, parameters, query parameters, and service-to-service dependency injection.

---

## Posts API

The `posts` module provides CRUD operations backed by PostgreSQL and TypeORM.

```text
GET    /posts
GET    /posts/:id
POST   /posts
PUT    /posts/:id
DELETE /posts/:id
```

### Validation

Post requests use DTOs with `class-validator`.

Examples of validation include:

- Required fields
- String validation
- Minimum and maximum length
- Integer validation for pagination parameters
- Query parameter validation

Global validation is configured with:

```ts
ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
})
```

### Post ownership

Authenticated users can create posts.

When updating a post, the service checks whether the current user owns the post or has the `ADMIN` role.

Deleting posts is restricted to users with the `ADMIN` role.

---

## PostgreSQL + TypeORM

The application uses PostgreSQL with TypeORM.

The current implementation includes:

- TypeORM entities
- Repository-based database operations
- `User` and `Post` entities
- User/Post relationship
- File entity and uploader relationship
- Automatically managed creation/update timestamps
- Development-time schema synchronization

The main entities are:

```text
User
 └── has many Posts

Post
 └── belongs to User

File
 └── belongs to User
```

> The application currently uses `synchronize: true` in the TypeORM configuration, which is suitable for development/learning but should be handled differently for production database schema management.

---

## Authentication

Authentication is implemented using:

- JWT
- Passport
- Passport JWT
- bcrypt

### Registration

```text
POST /auth/register
```

During registration:

1. The email is checked for an existing account.
2. The password is hashed with bcrypt.
3. A user is created with the `USER` role.
4. A `user.registered` event is emitted.
5. The stored password is excluded from the returned user object.

### Login

```text
POST /auth/login
```

The login flow:

```text
Email + Password
       ↓
Find user
       ↓
Compare password with bcrypt
       ↓
Generate access + refresh tokens
       ↓
Return user + tokens
```

### Refresh token

```text
POST /auth/refresh
```

The refresh token is verified and a new access token is generated.

### Current profile

```text
GET /auth/profile
```

This route is protected by the JWT authentication guard and returns the authenticated user.

---

## JWT Strategy and Authentication Guard

The project uses a custom JWT strategy with Passport.

```text
Request
  ↓
Authorization: Bearer <token>
  ↓
JwtAuthGuard
  ↓
JWT Strategy
  ↓
Load user
  ↓
Authenticated request
```

The authenticated user is then available through the `@CurrentUser()` custom decorator.

---

## Role-Based Access Control (RBAC)

Two roles are defined:

```text
USER
ADMIN
```

The project uses:

- `@Roles(...)` decorator
- `RolesGuard`
- `JwtAuthGuard`

The authorization flow is:

```text
Request
  ↓
JWT Authentication
  ↓
Current User
  ↓
RolesGuard
  ↓
Check required role
  ↓
Allow / Forbidden
```

Example protected admin route:

```text
POST /auth/create-admin
DELETE /posts/:id
```

The `ADMIN` role is required for these operations.

---

## Rate Limiting

Login requests are protected with a custom throttler guard.

The project uses:

```text
@nestjs/throttler
```

The custom `LoginThrottlerGuard` tracks login attempts using the email from the request body.

Current configuration:

```text
5 attempts
within 60 seconds
```

When the limit is exceeded, the application returns a throttling exception with a message asking the client to try again later.

The guard is applied to:

```text
POST /auth/login
```

### Dependency note

The project currently uses:

```text
@nestjs/throttler@6.5.0
```

with NestJS 12. Because this throttler version does not declare NestJS 12 in its peer dependency range, dependency installation may require:

```bash
npm install --legacy-peer-deps
```

---

## Caching

The `posts` service uses `@nestjs/cache-manager` with the in-memory cache store.

Caching is implemented for:

```text
GET /posts
GET /posts/:id
```

### Single post cache

A post uses a cache key similar to:

```text
post_1
```

The service first checks the cache before querying PostgreSQL.

```text
Request
  ↓
Check cache
  ├── Hit  → return cached post
  └── Miss → query database
              ↓
            store in cache
              ↓
            return post
```

### Posts list cache

List responses are cached using a key based on:

- Page
- Limit
- Title filter

Example:

```text
posts_list_page1_limit10_titleall
```

When a post is created, updated, or deleted, the related list caches are invalidated.

Individual post caches are also removed when a post is updated or deleted.

---

## Pagination and Filtering

The posts listing endpoint supports pagination and title filtering.

Example:

```text
GET /posts?page=1&limit=10
```

Title filtering:

```text
GET /posts?title=nestjs
```

Both can be combined:

```text
GET /posts?page=1&limit=10&title=nestjs
```

The response follows a paginated structure:

```json
{
  "items": [],
  "meta": {
    "currentPage": 1,
    "itemsPerPage": 10,
    "totalItems": 0,
    "totalPages": 0,
    "hasPreviousPage": false,
    "hasNextPage": false
  }
}
```

Pagination and filter query parameters are validated through DTOs.

---

## File Uploads

The project includes a file upload module using:

- Multer through `@nestjs/platform-express`
- Memory storage
- Cloudinary
- `streamifier`
- PostgreSQL / TypeORM for file metadata

### Upload flow

```text
Client
  ↓
multipart/form-data
  ↓
FileInterceptor
  ↓
Multer memory storage
  ↓
File buffer
  ↓
streamifier
  ↓
Cloudinary upload stream
  ↓
Cloudinary URL + public ID
  ↓
Save file metadata in PostgreSQL
```

### Endpoints

Upload a file:

```text
POST /file-upload
```

Authentication is required.

List uploaded files:

```text
GET /file-upload
```

Delete a file:

```text
DELETE /file-upload/:id
```

Deletion is restricted to `ADMIN` users.

The database stores metadata such as:

- Original filename
- MIME type
- Size
- Cloudinary URL
- Cloudinary public ID
- Optional description
- Uploading user
- Creation time

---

## Events and Listeners

The project uses `@nestjs/event-emitter` for a simple event-driven flow around user registration.

When a user registers:

```text
User registration
      ↓
Save user
      ↓
Emit "user.registered"
      ↓
UserRegisteredListener
      ↓
Log welcome message
```

The event contains:

```text
User ID
Email
Name
Timestamp
```

The listener currently logs a welcome message. It can later be replaced or extended with actions such as email sending or other side effects.

---

## Interceptors

A global `LoggingInterceptor` is registered in `main.ts`.

It demonstrates how an interceptor can observe request/response execution and log information such as:

- HTTP method
- URL
- User ID when available
- User-Agent
- Request duration
- Response size
- Error information

Conceptually:

```text
Request
  ↓
Interceptor
  ↓
Controller
  ↓
Service
  ↓
Response
  ↓
Interceptor logging
```

---

## Middleware

A custom `LoggerMiddleware` is applied to all routes.

It logs request information including:

- HTTP method
- Original URL
- Client IP
- User-Agent

It also measures the time between the incoming request and the response finishing.

Conceptually:

```text
Incoming request
      ↓
LoggerMiddleware
      ↓
Route handler
      ↓
Service
      ↓
Response
      ↓
Middleware logs status + duration
```

---

## Project Structure

```text
src/
├── auth/
│   ├── decorators/
│   ├── dto/
│   ├── entities/
│   ├── guards/
│   └── strategies/
│
├── posts/
│   ├── dto/
│   ├── entities/
│   ├── interfaces/
│   └── pipes/
│
├── file-upload/
│   ├── cloudinary/
│   ├── dto/
│   └── entities/
│
├── events/
│   └── listeners/
│
├── common/
│   ├── dto/
│   ├── interfaces/
│   ├── interceptors/
│   └── middleware/
│
├── config/
├── hello/
├── user/
├── app.controller.ts
├── app.module.ts
├── app.service.ts
└── main.ts
```

---

## Tech Stack

| Technology | Usage |
|---|---|
| NestJS 12 | Backend framework |
| TypeScript | Application language |
| PostgreSQL | Relational database |
| TypeORM | ORM and database access |
| Passport | Authentication integration |
| Passport JWT | JWT authentication strategy |
| JWT | Access and refresh tokens |
| bcrypt | Password hashing |
| class-validator | Request validation |
| class-transformer | DTO transformation |
| @nestjs/config | Configuration |
| @nestjs/throttler | Rate limiting |
| @nestjs/cache-manager | Caching |
| cache-manager | Cache implementation |
| Multer | Multipart file handling |
| Cloudinary | File storage |
| streamifier | Buffer-to-stream conversion |
| @nestjs/event-emitter | Events and listeners |

---

## Getting Started

### Prerequisites

Install the following:

- Node.js
- npm
- PostgreSQL
- Git
- A Cloudinary account for the file-upload functionality

### Clone the repository

```bash
git clone https://github.com/abhishek-kr01/nestjs-backend.git
cd nestjs-backend
```

### Install dependencies

Because of the current NestJS 12 + throttler dependency range:

```bash
npm install --legacy-peer-deps
```

### Database

Create a PostgreSQL database named:

```text
nestjs-backend
```

The current database connection is configured in:

```text
src/app.module.ts
```

Update the PostgreSQL username/password there to match your local setup.

### Cloudinary

Cloudinary credentials are configured in:

```text
src/file-upload/cloudinary/cloudinary.provider.ts
```

Update the configuration values with your Cloudinary account credentials before using the file-upload endpoints.

### Start the application

Development:

```bash
npm run start:dev
```

Build:

```bash
npm run build
```

Production start:

```bash
npm run start:prod
```

The application listens on port `3000` by default unless `PORT` is provided.

---

## Environment Configuration

The project contains an `@nestjs/config` setup and an application config file:

```text
src/config/app.config.ts
```

The current database, JWT, and Cloudinary settings are still configured directly in parts of the application code, so review those values before sharing or deploying the project.

Never commit real credentials, secrets, or API keys to the repository.

---

## Available Scripts

```bash
npm run start:dev     # start development server
npm run build         # build the application
npm run start         # start application
npm run start:prod    # run compiled application
npm run lint          # run oxlint
npm test              # run unit tests
npm run test:watch    # run tests in watch mode
npm run test:cov      # run tests with coverage
npm run test:e2e      # run end-to-end tests
npm run format        # format source files
```

---

## Development Flow

The project was built incrementally so that each NestJS concept could be added to the same application.

```text
NestJS basics
      ↓
REST APIs
      ↓
DTOs + Validation
      ↓
PostgreSQL + TypeORM
      ↓
JWT Authentication
      ↓
RBAC + Guards
      ↓
Rate Limiting
      ↓
Caching
      ↓
Pagination + Filtering
      ↓
File Uploads
      ↓
Events + Listeners
      ↓
Interceptors
      ↓
Middleware
```

Each feature was implemented and tested during development before moving to the next part.

---

## Notes

This repository is primarily a practical learning and reference codebase.

Some parts of the implementation are intentionally simple so the underlying NestJS concept remains easy to follow. Before using the same setup in a production application, areas such as secret management, database migrations, file validation, error handling, testing, and production cache infrastructure should be reviewed separately.

---

## Author

**Abhishek Kumar**

GitHub: [abhishek-kr01](https://github.com/abhishek-kr01)

Repository: [nestjs-backend](https://github.com/abhishek-kr01/nestjs-backend)
