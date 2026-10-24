# PawCare API — NestJS

This is the NestJS/TypeScript migration of the original `PawCare.Server` ASP.NET Core Minimal API.

## Stack

- NestJS
- TypeScript
- PostgreSQL
- Prisma
- JWT + Passport
- bcrypt
- class-validator
- Swagger/OpenAPI

## API compatibility

The HTTP surface is intentionally kept compatible with the React client:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/pets`
- `GET /api/pets/:id`
- `POST /api/pets`
- `PUT /api/pets/:id`
- `DELETE /api/pets/:id`
- `GET /api/veterinarians`
- `GET /api/veterinarians/:id`
- `POST /api/appointments`
- `GET /api/appointments/me`
- `GET /health`

Swagger UI is available at `/docs`.

## Run locally

1. Copy `.env.example` to `.env` and set `DATABASE_URL` and `JWT_SECRET`.
2. Install dependencies:

```bash
npm install
```

3. Generate Prisma Client:

```bash
npm run prisma:generate
```

4. Create/update the database:

```bash
npm run prisma:migrate -- --name init
```

5. Seed development veterinarians:

```bash
npm run prisma:seed
```

6. Start:

```bash
npm run start:dev
```

## Seed veterinarian credentials

The five development veterinarians use `Password1` as the seeded password. Do not use this password outside local development.
