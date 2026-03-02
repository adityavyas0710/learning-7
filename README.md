# NestJS + TypeORM Example

A minimal NestJS project with TypeORM entities, relations, and migrations.

## Database Schema

- **Users**: Basic user information
- **Posts**: Blog posts with author relationship
- **Tags**: Post categorization
- **Post_Tags**: Many-to-many join table

## Relations

- User → Posts (One-to-Many)
- Post → User (Many-to-One)
- Post ↔ Tags (Many-to-Many)

## Setup

```bash
# Install dependencies
npm install

# Create PostgreSQL database
createdb nestjs_db

# Run migrations
npm run migration:run

# Start development server
npm run start:dev
```

## Migration Commands

```bash
# Generate new migration
npm run migration:generate -- src/migrations/MigrationName

# Run migrations
npm run migration:run

# Revert last migration
npm run migration:revert
```
