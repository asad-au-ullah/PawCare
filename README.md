<div align="center">

# 🐾 PawCare

### Full-Stack Veterinary Appointment Management Platform

**Next.js • NestJS • TypeScript • PostgreSQL**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square\&logo=next.js)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-11-E0234E?style=flat-square\&logo=nestjs)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square\&logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square\&logo=postgresql)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
[![Release](https://img.shields.io/badge/Release-v1.0.0--mvp-orange?style=flat-square)]()
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square)]()

<br/>

> PawCare is a full-stack veterinary appointment management platform that enables pet owners to register, manage their pets, browse veterinarians, and book appointments through a clean and responsive interface.

<br/>

[Live Demo](https://paw-care-vet.vercel.app)  •  [API](#)  •  [Report Bug](#)  •  [Request Feature](#)

</div>

---

## 📋 Table of Contents

* [Features](#-features)
* [Demo](#-demo)
* [Screenshots](#-screenshots)
* [Architecture](#-architecture)
* [Tech Stack](#-tech-stack)
* [Getting Started](#-getting-started)
* [Configuration](#-configuration)
* [Demo Credentials](#-demo-credentials)
* [Project Structure](#-project-structure)
* [MVP Workflow](#-mvp-workflow)
* [Engineering Evolution](#-engineering-evolution)
* [Roadmap](#-roadmap)
* [Contributing](#-contributing)
* [License](#-license)
* [Author](#-author)

---

## ✨ Features

|                                                                                 |                                                                                 |
| ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| 🐶 **Pet Management** — Manage multiple pets with full CRUD operations.         | 📅 **Appointment Booking** — Schedule appointments with veterinarians.          |
| 🔒 **JWT Authentication** — Secure authentication and role-based authorization. | 👩‍⚕️ **Veterinarian Directory** — Browse available veterinarians by specialty. |
| 📋 **Appointment Tracking** — View and manage upcoming appointments.            | 📱 **Responsive Design** — Optimized for desktop and mobile devices.            |

---

## 🎥 Demo

<!-- walkthrough -->

<video src="https://github.com/user-attachments/assets/d22687e8-7a50-4269-9bfe-6fb87846644d" width="1280" height="720" controls></video>

---

## 📸 Screenshots

<table>
  <tr>
    <th colspan="6" align="center"><b>Home</b></th>
  </tr>
  <tr>
    <td colspan="6" align="center">
      <img width="100%" alt="home-page" src="https://github.com/user-attachments/assets/137ec144-4ad9-408f-83d0-cadc45d8adfe" />
    </td>
  </tr>

  <tr>
    <th colspan="3" align="center"><b>Register</b></th>
    <th colspan="3" align="center"><b>Login</b></th>
  </tr>
  <tr>
    <td colspan="3">
      <img width="100%" alt="register-page" src="https://github.com/user-attachments/assets/2d51e4c1-7098-4166-a4cc-24d21664502c" />
    </td>
    <td colspan="3">
      <img width="100%" alt="login-page" src="https://github.com/user-attachments/assets/23f1a128-592f-407c-8398-ef86bbe99195" />
    </td>
  </tr>

  <tr>
    <th colspan="2" align="center"><b>Dashboard</b></th>
    <th colspan="2" align="center"><b>My Appointments</b></th>
    <th colspan="2" align="center"><b>Veterinarian Directory</b></th>
  </tr>
  <tr>
    <td colspan="2">
      <img width="100%" alt="dashboard-page" src="https://github.com/user-attachments/assets/ff068a6e-8823-4de8-a834-e4a7013d7ae6" />
    </td>
    <td colspan="2">
      <img width="100%" alt="my-appointments-page" src="https://github.com/user-attachments/assets/b422610c-e2e1-4647-90a3-0cb03d7ba954" />
    </td>
    <td colspan="2">
      <img width="100%" alt="veterinarian-directory-page" src="https://github.com/user-attachments/assets/8ea8301d-cf39-4a71-bd9b-874a59e8c959" />
    </td>
  </tr>

  <tr>
    <th colspan="2" align="center"><b>My Pets</b></th>
    <th colspan="2" align="center"><b>Add Pet</b></th>
    <th colspan="2" align="center"><b>Edit Pet</b></th>
  </tr>
  <tr>
    <td colspan="2">
      <img width="100%" alt="my-pets-page" src="https://github.com/user-attachments/assets/fb12627b-a756-4b7a-beea-fa5b0b928b0c" />
    </td>
    <td colspan="2">
      <img width="100%" alt="add-pet-page" src="https://github.com/user-attachments/assets/f517cb7c-6d64-4326-91af-557044168f1f" />
    </td>
    <td colspan="2">
      <img width="100%" alt="edit-pet-page" src="https://github.com/user-attachments/assets/df19a060-12ab-49af-970d-1b4b3f867fed" />
    </td>
  </tr>
</table>

---

## 🏗 Architecture

```mermaid
flowchart TB

%% =========================
%% CLIENT LAYER
%% =========================

subgraph Client["Client Layer"]
    User["👤 Pet Owner / Veterinarian"]
    Next["Next.js<br/>TypeScript<br/>App Router<br/>Tailwind CSS"]
    User --> Next
end

%% =========================
%% API LAYER
%% =========================

Next -- HTTPS / REST API<br/>JWT --> API

subgraph API["NestJS API"]
    subgraph Modules["Feature Modules"]
        Auth["Auth Module"]
        Pet["Pets Module"]
        Vet["Veterinarians Module"]
        Appointment["Appointments Module"]
    end

    subgraph Business["Business Rules"]
        Validation["Request Validation"]
        Authorization["JWT Authorization"]
        Scheduling["Appointment Scheduling"]
    end

    Auth --> Authorization
    Pet --> Validation
    Vet --> Validation
    Appointment --> Scheduling
end

%% =========================
%% DATA ACCESS
%% =========================

subgraph Data["Persistence Layer"]
    Prisma["Prisma ORM"]
    SQL[("PostgreSQL")]
    Prisma --> SQL
end

Auth --> Prisma
Pet --> Prisma
Vet --> Prisma
Appointment --> Prisma

%% =========================
%% DATABASE
%% =========================

subgraph Database["Database"]
    Users["Users"]
    Roles["Roles"]
    Owners["Pet Owners"]
    Vets["Veterinarians"]
    Pets["Pets"]
    Appointments["Appointments"]
end

SQL --> Users
SQL --> Roles
SQL --> Owners
SQL --> Vets
SQL --> Pets
SQL --> Appointments

%% =========================
%% FUTURE INTEGRATIONS
%% =========================

subgraph Future["External Services"]
    Stripe["Stripe Payments"]
    Jitsi["Jitsi Meet"]
    Email["Email Notifications"]
    Storage["Cloud Storage"]
    Calendar["Calendar Integration"]
    Monitoring["Logging & Monitoring"]
end

Appointment -. Future .-> Stripe
Appointment -. Future .-> Jitsi
Auth -. Future .-> Email
Pet -. Future .-> Storage
Appointment -. Future .-> Calendar
API -. Telemetry .-> Monitoring
```

PawCare uses a separated frontend and backend architecture within a single repository:

* **Next.js** handles the web application and user-facing experience.
* **NestJS** provides the dedicated REST API and business logic layer.
* **Prisma** provides type-safe database access.
* **PostgreSQL** provides relational persistence.

This separation keeps the frontend focused on presentation and application delivery while allowing the backend to evolve independently as the domain grows.

---

## 🛠 Tech Stack

### Frontend

| Technology            | Purpose                                 |
| --------------------- | --------------------------------------- |
| Next.js               | React framework and web application     |
| TypeScript            | Type safety                             |
| App Router            | Application routing and layouts         |
| TanStack Query        | Server state, caching, and invalidation |
| React Hook Form + Zod | Form management and validation          |
| Tailwind CSS          | Utility-first styling                   |
| shadcn/ui             | Reusable UI components                  |
| Axios                 | HTTP client and API communication       |
| Sonner                | Toast notifications                     |

### Backend

| Technology        | Purpose                                          |
| ----------------- | ------------------------------------------------ |
| NestJS            | Structured REST API and application architecture |
| TypeScript        | Type safety                                      |
| Prisma            | Type-safe ORM and database access                |
| PostgreSQL        | Relational database                              |
| JWT               | Stateless authentication                         |
| Passport          | Authentication strategy integration              |
| class-validator   | Request validation                               |
| Swagger / OpenAPI | API documentation                                |

### Infrastructure & Development

| Technology     | Purpose                        |
| -------------- | ------------------------------ |
| Vercel         | Application and API deployment |
| Neon           | Managed PostgreSQL             |
| Git & GitHub   | Version control                |
| GitHub Actions | CI/CD                          |

---

## 🚀 Getting Started

### Prerequisites

* [Node.js 22+](https://nodejs.org/)
* [PostgreSQL 16+](https://www.postgresql.org/download/)
* Git

### Clone the repository

```bash
git clone https://github.com/asad-au-ullah-portfolio/PawCare.git
cd PawCare
```

### Install dependencies

Install dependencies for both applications:

```bash
cd PawCare.Client
npm install

cd ../PawCare.Server
npm install
```

### Database

Configure your PostgreSQL connection string in the backend environment variables.

Then generate the Prisma client and apply the database schema:

```bash
npx prisma generate
npx prisma migrate dev
```

If seed data is configured:

```bash
npm run prisma:seed
```

### Start the backend

```bash
cd PawCare.Server
npm run start:dev
```

The NestJS API will run on the configured local API port.

### Start the frontend

In another terminal:

```bash
cd PawCare.Client
npm run dev
```

The Next.js application will be available at:

```text
http://localhost:3000
```

---

## ⚙️ Configuration

### Backend

Create an environment file inside `PawCare.Server`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE"

JWT_SECRET="YOUR_SECRET_KEY"
JWT_EXPIRES_IN="1h"

PORT=3001
```

### Frontend

Create an environment file inside `PawCare.Client`:

```env
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

Never commit real secrets or production credentials to the repository.

---

## 📂 Project Structure

```text
PawCare/
│
├── PawCare.Client/
│   ├── app/
│   │   ├── (auth)/
│   │   ├── dashboard/
│   │   ├── appointments/
│   │   ├── pets/
│   │   └── ...
│   │
│   ├── components/
│   │   └── ...
│   ├── hooks/
│   ├── lib/
│   ├── services/
│   ├── public/
│   └── package.json
│
├── PawCare.Server/
│   ├── src/
│   │   ├── auth/
│   │   ├── pets/
│   │   ├── appointments/
│   │   ├── veterinarians/
│   │   └── ...
│   │
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   │
│   └── package.json
│
└── README.md
```

---

## 📌 MVP Workflow

The current MVP supports the complete end-to-end user journey:

```text
Register
   ↓
Login
   ↓
Dashboard
   ↓
Add Pet
   ↓
Browse Veterinarians
   ↓
Book Appointment
   ↓
View My Appointments
```

---

## 🔄 Engineering Evolution

PawCare was originally developed using **React + ASP.NET Core**.

As the project evolved, the application was migrated to a modern **TypeScript-based full-stack architecture using Next.js + NestJS + Prisma**.

The migration preserved the application's core functionality and API contracts while replacing the original backend infrastructure with:

```text
ASP.NET Core
    ↓
NestJS

Entity Framework Core
    ↓
Prisma

ASP.NET Identity / JWT plumbing
    ↓
NestJS authentication architecture

React + Vite
    ↓
Next.js
```

The migration provided an opportunity to reassess the application's architecture rather than simply porting the existing implementation line-for-line.

The current repository represents the **Next.js + NestJS implementation**.

---

## 🌍 Deployment

| Layer       | Platform        |
| ----------- | --------------- |
| Frontend    | Vercel          |
| Backend API | Vercel          |
| Database    | Neon PostgreSQL |

### Production Architecture

```text
                    Vercel
             ┌─────────────────┐
             │                 │
             │    Next.js      │
             │    Web App      │
             │                 │
             │        ↓        │
             │                 │
             │    NestJS API   │
             │                 │
             └────────┬────────┘
                      │
                      ↓
               Neon PostgreSQL
```

---

## 💡 Engineering Highlights

* Modular backend architecture using NestJS
* Feature-oriented separation of authentication, pets, veterinarians, and appointments
* Stateless JWT authentication and authorization
* Ownership-scoped data access
* Type-safe database access with Prisma
* PostgreSQL relational data model
* Server-state management and caching with TanStack Query
* Form validation using React Hook Form and Zod
* Responsive UI built with Tailwind CSS and shadcn/ui
* Next.js App Router architecture
* Separated frontend and backend responsibilities
* Full-stack TypeScript development
* Migration from React + ASP.NET Core to Next.js + NestJS + Prisma
* Cloud deployment using Vercel and Neon PostgreSQL

---

## 🛣 Roadmap

### v1.1 — Infrastructure

* [x] Next.js migration
* [x] NestJS migration
* [x] Prisma migration
* [x] Cloud deployment
* [ ] CI/CD with GitHub Actions
* [ ] Structured logging
* [ ] Health checks
* [ ] API rate limiting

### v1.2 — Quality

* [ ] Integration tests
* [ ] End-to-end tests
* [ ] OpenTelemetry
* [ ] API documentation
* [ ] Performance monitoring
* [ ] Automated database migration workflow

### v2.0 — Features

* [ ] Google Calendar integration
* [ ] Email notifications & appointment reminders
* [ ] Online payments with Stripe
* [ ] Real-time video consultations with Jitsi
* [ ] Medical records & e-prescriptions
* [ ] Reviews & ratings
* [ ] Admin dashboard
* [ ] Multi-tenant / white-label configuration

---

## 🤝 Contributing

Contributions, suggestions, and feedback are welcome.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 👨‍💻 Author

**Asadullah Ehsan**

* LinkedIn: [Asadullah Ehsan](https://www.linkedin.com/in/asadullahehsan/)
* GitHub: [asad-au-ullah](https://github.com/asad-au-ullah)

---

<div align="center">

If you found this project useful, consider giving it a ⭐

</div>
