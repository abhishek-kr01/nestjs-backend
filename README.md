# NestJS Backend

A hands-on NestJS backend codebase built to practice and demonstrate core backend concepts, architecture patterns, and commonly used NestJS features through practical implementations.

The project starts with a simple REST API and progressively adds validation, database integration, authentication, authorization, rate limiting, caching, pagination, file uploads, events, interceptors, and middleware.

---

## 📌 What This Project Covers

### NestJS Fundamentals
- Project structure and modular architecture
- Modules
- Controllers
- Services
- Dependency Injection
- Environment configuration

### REST API Development
- RESTful API design
- CRUD operations
- DTOs
- Pipes
- Request validation
- Pagination
- Filtering

### Database
- PostgreSQL
- TypeORM
- Entities
- Repository-based data access
- Entity relationships
- Automatic timestamps

### Authentication & Authorization
- JWT authentication
- Password hashing with bcrypt
- Passport
- JWT Strategy
- Authentication Guards
- Role-Based Access Control (RBAC)

### API Security & Performance
- Rate limiting with NestJS Throttler
- In-memory caching
- Request/response logging
- Interceptors
- Middleware

### File Handling
- Multipart file uploads
- Multer through `@nestjs/platform-express`
- Cloudinary integration
- Stream-based uploads with `streamifier`
- File deletion from Cloudinary

### Event-Driven Architecture
- EventEmitter
- Event publishing
- Event listeners
- Decoupling application actions using events

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **NestJS 12** | Backend framework |
| **TypeScript** | Application language |
| **PostgreSQL** | Relational database |
| **TypeORM** | ORM and database access |
| **JWT** | Authentication |
| **Passport / Passport JWT** | Authentication strategy |
| **bcrypt** | Password hashing |
| **class-validator** | DTO validation |
| **class-transformer** | Data transformation |
| **@nestjs/config** | Environment configuration |
| **@nestjs/throttler** | Rate limiting |
| **@nestjs/cache-manager** | Application caching |
| **Cloudinary** | File/media storage |
| **Multer** | Multipart file handling |
| **streamifier** | Buffer-to-stream conversion |
| **@nestjs/event-emitter** | Event-driven communication |

---

## 🧩 Features Implemented

### 1. Modules, Controllers & Services
The project follows NestJS's modular architecture by separating application responsibilities into modules, controllers, and services.

This provides a clean structure where:
- Controllers handle incoming requests.
- Services contain application/business logic.
- Modules organize related functionality.

### 2. Environment Configuration
Environment-specific configuration is handled using `@nestjs/config`.

Sensitive and environment-specific values such as database credentials, JWT configuration, and Cloudinary configuration can be supplied through environment variables instead of hardcoding them in the source code.

Example:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=nestjs-backend

JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

> Do not commit `.env` files or real credentials to Git.

---

### 3. RESTful CRUD APIs
The `posts` module demonstrates CRUD operations using REST endpoints and TypeORM.

Typical operations include:

```text
POST   /posts
GET    /posts
GET    /posts/:id
PATCH  /posts/:id
DELETE /posts/:id
```

The implementation evolved from in-memory CRUD to PostgreSQL-backed persistence.

---

### 4. DTOs, Pipes & Validation
Request payloads are handled through DTOs and validated using `class-validator` and `class-transformer`.

This helps keep validation logic separate from controllers and makes request contracts explicit.

Examples of validation include:
- Required fields
- String length constraints
- Data type validation
- Query parameter validation

---

### 5. PostgreSQL + TypeORM
The project uses PostgreSQL as the primary database and TypeORM for database access.

The implementation includes:
- Entity definitions
- TypeORM configuration
- Repository-based operations
- Entity relationships
- Automatic `createdDate` / `updatedDate` timestamps
- Development-time schema synchronization

> `synchronize: true` is intended for development/learning use and should be used carefully in production environments.

---

### 6. JWT Authentication
Authentication is implemented using JWT, Passport, and bcrypt.

The authentication flow includes:

```text
User credentials
      ↓
Password verification
      ↓
JWT generation
      ↓
Client sends JWT
      ↓
JWT Strategy
      ↓
Authentication Guard
      ↓
Protected route
```

Passwords are hashed with bcrypt rather than stored as plain text.

---

### 7. Role-Based Access Control (RBAC)
Authorization is separated from authentication using roles and guards.

Conceptually:

```text
Authentication
    ↓
"Who are you?"

Authorization
    ↓
"What are you allowed to do?"
```

RBAC allows protected resources to be restricted based on a user's role.

---

### 8. Rate Limiting
Rate limiting is implemented using `@nestjs/throttler`.

This helps reduce excessive requests to protected endpoints and demonstrates how request throttling can be integrated into a NestJS application.

The project currently uses:

```text
@nestjs/throttler 6.5.0
```

> Because the current throttler package has a peer-dependency range that does not include NestJS 12, dependency installation may require `--legacy-peer-deps` with the current setup.

---

### 9. Caching
In-memory caching is implemented using:

```text
@nestjs/cache-manager
cache-manager
```

Caching can reduce repeated work for frequently requested data and demonstrates where a cache layer can be introduced in a NestJS application.

---

### 10. Pagination & Filtering
The posts API includes query-based pagination and filtering.

Example:

```text
GET /posts?page=1&limit=10
```

Filtering can be extended through query DTOs without mixing query parsing and business logic directly into the controller.

---

### 11. File Uploads with Cloudinary
The file-upload module demonstrates a multipart upload flow using Multer and Cloudinary.

Flow:

```text
Client
  ↓
Multipart/Form-Data
  ↓
Multer
  ↓
File Buffer
  ↓
streamifier
  ↓
Cloudinary Upload Stream
  ↓
Cloudinary URL / Resource
```

The implementation also includes Cloudinary resource deletion.

---

### 12. Events & Listeners
The project uses `@nestjs/event-emitter` to demonstrate event-driven communication.

Example architecture:

```text
Application Action
       ↓
   Emit Event
       ↓
   Event Listener
       ↓
  Side Effect
```

This allows related actions to be decoupled instead of putting every side effect directly inside the initiating service.

---

### 13. Interceptors
Interceptors are used to demonstrate cross-cutting request/response behavior.

The project includes HTTP logging behavior such as:
- HTTP method
- Request URL
- Client IP
- User-Agent
- Response status code
- Request duration
- Error-level logging for 5xx responses
- Warning-level logging for 4xx responses

Example log format:

```text
[RESPONSE] -> GET /posts - 200 - 15ms
```

---

### 14. Middleware
A custom HTTP logging middleware captures request information before the request reaches the route handler and measures the response duration.

Conceptually:

```text
Incoming Request
      ↓
   Middleware
      ↓
   Controller
      ↓
    Service
      ↓
   Response
      ↓
 Middleware logs result
```

This demonstrates where application-wide request preprocessing and logging can be placed.

---

## 📁 Project Structure

The project is organized around NestJS modules and shared cross-cutting functionality.

```text
src/
├── auth/
│   ├── guards/
│   └── ...
│
├── posts/
│   ├── dto/
│   ├── entities/
│   └── ...
│
├── file-upload/
│   └── cloudinary/
│
├── events/
│   └── listeners/
│
├── common/
│   ├── interceptors/
│   └── middleware/
│
├── config/
│
├── app.module.ts
└── main.ts
```

> The exact contents of some folders may evolve as additional NestJS concepts are added.

---

## ⚙️ Getting Started

### Prerequisites

Make sure the following are installed:

- Node.js
- npm
- PostgreSQL
- Git

### 1. Clone the repository

```bash
git clone https://github.com/abhishek-kr01/nestjs-backend.git
cd nestjs-backend
```

### 2. Install dependencies

With the current dependency setup:

```bash
npm install --legacy-peer-deps
```

This is currently needed because `@nestjs/throttler@6.5.0` declares a peer dependency range that does not include NestJS 12.

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=nestjs-backend

JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Use your own local database credentials and Cloudinary credentials.

### 4. Start PostgreSQL

Make sure your PostgreSQL server is running and the configured database exists.

### 5. Start the application

Development mode:

```bash
npm run start:dev
```

Production build:

```bash
npm run build
npm run start:prod
```

The API will be available at:

```text
http://localhost:3000
```

---

## 🧪 Development Workflow

This repository is intentionally built incrementally.

A typical workflow is:

```text
Implement a feature
      ↓
Run TypeScript compilation
      ↓
Start NestJS application
      ↓
Test endpoints
      ↓
Verify database / logs / events
      ↓
Commit changes
      ↓
Push to GitHub
```

This keeps each backend concept isolated enough to understand while still showing how the pieces work together in a single NestJS codebase.

---

## 🔐 Security Notes

This project is primarily a hands-on learning/reference codebase. Before using similar patterns in production, consider adding or reviewing:

- Secrets management
- Production database migrations
- Proper database schema/version management
- Strong JWT secret management
- CORS policy
- Helmet/security headers
- Request size limits
- File type and file size validation
- Production-grade cache storage such as Redis
- Centralized error handling
- Structured logging
- Comprehensive automated tests

---

## 🚧 Current Scope

Completed concepts currently include:

```text
✅ NestJS project structure
✅ Modules, Controllers & Services
✅ Environment Configuration
✅ RESTful CRUD
✅ DTOs, Pipes & Validation
✅ PostgreSQL & TypeORM
✅ JWT Authentication
✅ bcrypt Password Hashing
✅ JWT Strategy
✅ Authentication Guards
✅ RBAC
✅ Rate Limiting
✅ In-memory Caching
✅ Pagination & Filtering
✅ File Uploads with Cloudinary
✅ Events & Listeners
✅ Interceptors
✅ Middleware
```

The codebase can be extended further with additional NestJS patterns and production-oriented backend features.

---

## 🎯 Purpose

The goal of this repository is to provide a practical NestJS backend codebase where concepts are learned by implementing them rather than only reading about them.

It serves as:
- A hands-on NestJS reference
- A place to experiment with backend architecture
- A progressively built REST API
- A practical example of integrating common backend concerns
- A reusable foundation for future NestJS projects

---

## 📚 Learning Approach

Instead of keeping each concept as an isolated snippet, this repository builds the features progressively:

```text
NestJS Fundamentals
        ↓
REST APIs
        ↓
Validation
        ↓
Database
        ↓
Authentication
        ↓
Authorization
        ↓
Security
        ↓
Caching
        ↓
File Handling
        ↓
Events
        ↓
Interceptors
        ↓
Middleware
```

The result is a backend codebase that demonstrates how individual NestJS features fit together inside a real application structure.

---

## 👨‍💻 Author

**Abhishek Kumar**

GitHub: [abhishek-kr01](https://github.com/abhishek-kr01)
