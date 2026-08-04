# AuthAPI

Full-stack authentication project that recreates a **professional-grade auth environment** for learning and practice. It covers the end-to-end flow used in real applications: secure registration and login, JWT-based authorization, role-based access control, a containerized SQL Server database, and a modern Angular frontend that manages session state with the **Signals** pattern.

## Overview

This repository includes:

- **Backend (`AuthAPI`)** — ASP.NET Core Web API with JWT Bearer authentication, EF Core, and a repository pattern.
- **Frontend (`auth-frontend`)** — Angular 21 SPA with reactive auth state via Signals, route guards, and an HTTP interceptor.
- **Database** — Microsoft SQL Server 2022 running in Docker via `docker-compose`.

The goal is to mirror how authentication is typically structured in professional environments: separated API and client, token-based security, roles (`Admin` / `User`), hashed passwords, and clear separation of concerns on both sides.

## Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| ASP.NET Core (`.NET 10`) | Web API |
| JWT Bearer (`Microsoft.AspNetCore.Authentication.JwtBearer`) | Stateless authentication |
| Entity Framework Core + SQL Server | Data access and persistence |
| Swashbuckle (Swagger / OpenAPI) | API documentation and testing |
| Repository pattern | Clean data-access abstraction |
| ASP.NET Identity password hasher | Secure password hashing |

### Frontend
| Technology | Purpose |
|---|---|
| Angular 21 | SPA |
| Angular Signals | Reactive auth / UI state |
| HTTP Interceptor | Attaches JWT to outgoing requests |
| Route Guards | Protects authenticated and guest-only routes |
| RxJS | HTTP observables |
| Vitest | Unit testing |

### Infrastructure
| Technology | Purpose |
|---|---|
| Docker Compose | Containerized SQL Server 2022 |
| Named Docker volume | Persistent database data |

## Features

- User **registration** and **login**
- **JWT** issuance and validation
- **Role-based authorization** (`Admin`, `User`)
- Admin-only endpoints (list users, update roles)
- Password hashing (never store plain-text passwords)
- CORS configuration for the Angular client
- Swagger UI with Bearer token support
- Angular session management with Signals (`currentUser`)
- Auth and guest route guards
- JWT HTTP interceptor
- Dockerized SQL Server database

## Project Structure

```text
AuthAPI/
├── AuthAPI/                 # ASP.NET Core Web API
│   ├── Controllers/         # API endpoints
│   ├── Constants/           # Roles, CORS policy names
│   ├── Data/                # EF Core DbContext
│   ├── Models/              # Entities and DTOs
│   ├── Repository/          # Data access (IUserRepository / UserRepository)
│   ├── Migrations/          # EF Core migrations
│   ├── Program.cs           # DI, JWT, Swagger, CORS
│   └── docker-compose.yml   # SQL Server container
└── auth-frontend/           # Angular 21 SPA
    └── src/
        ├── components/      # Login, Register, Dashboard
        ├── guards/          # auth.guard, guest.guard
        ├── interceptors/    # JWT interceptor
        └── services/auth/   # Auth service (Signals)
