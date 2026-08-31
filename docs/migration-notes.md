# Migration notes

## Why Prisma instead of EF Core?

EF Core is removed from the application boundary. Prisma provides the PostgreSQL data-access layer idiomatic to a NestJS/TypeScript application while preserving the domain relationships and database concepts.

## Why a new `Users` table?

The original app uses ASP.NET Core Identity, which creates a family of `AspNet*` tables and uses Microsoft's password-hash format. The NestJS version intentionally uses a smaller application-owned `Users` model with bcrypt. This avoids carrying an ASP.NET-specific persistence subsystem into the TypeScript application.

If the deployed system must preserve existing production users, a dedicated data migration should be performed before cutover. Password hashes can be migrated with a one-time compatibility verifier for ASP.NET Identity v3, then rehashed with bcrypt after a successful login. The development seed data in this repository therefore uses bcrypt and a new schema.

## HTTP behavior preserved

The migration keeps the existing route paths, response property names, numeric enum values exposed to the React client, JWT role claim, appointment overlap rule, pet ownership checks, veterinarian filtering, and health endpoint.

The original Minimal API returns numeric enum values to JSON because it does not configure a string enum converter. Prisma stores the domain enums as named values internally, so the NestJS response mapping converts them back to the original numeric values.
