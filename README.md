# CrossLink

## Running the Application

### Using Docker (Recommended)

Start the entire stack (frontend, backend, and database):

```bash
docker-compose up
```

To run in detached mode:

```bash
docker-compose up -d
```

Start individual services:

```bash
# Start only the backend
docker-compose up backend

# Start only the frontend
docker-compose up frontend

# Start only the database
docker-compose up db
```

### Without Docker (Alternative)

- For backend:

```bash
cd backend
npm install
npm run start:dev
```

- For frontend:

```bash
cd frontend
npm install
npm run dev
```

### Accessing the application

- Frontend: http://localhost:3001 (Docker) or http://localhost:5173 (local)
- Backend API: http://localhost:3000
- Database: PostgreSQL running on port 5433

_Swagger Documentation_

Visit http://localhost:3001/api to view the Swagger UI.

## Database Operations

### Using Docker

**Running database migrations**:

```bash
docker-compose exec backend npm run typeorm:migration:run
```

**Generating migrations**:

```bash
docker-compose exec backend npm run typeorm:migration:generate -n <FileName>
```

**Seeding the database**:

```bash
docker-compose exec backend npm run seed
```

### Without Docker

**Run migration**:

```bash
cd backend
npm run typeorm:migration:generate -n <FileName>
npm run typeorm:migration:run
```

**Seed Data**:

```bash
cd backend
npm run seed
```

## /auth/register

_Example Request:_

```
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

_Example response:_

```
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "isVerified": false,
  "verificationToken": "550e8400-e29b-41d4-a716-446655440000",
  "createdAt": "2023-10-01T12:00:00.000Z",
  "updatedAt": "2023-10-01T12:00:00.000Z"
}
```

## Running Tests

### Using Docker

**Using the script provided**:

```bash
./scripts/run-backend-tests.sh
```

**Inside the Docker container**:

```bash
docker-compose exec backend npm test
```

**For test coverage**:

```bash
docker-compose exec backend npm run test:cov
```

**For debugging tests**:

```bash
docker-compose exec backend npm run test:debug
```

**Running specific test files**:

```bash
# Run a specific test file
docker-compose exec backend npx jest path/to/test-file.spec.ts

# Run tests with a specific pattern in their names
docker-compose exec backend npx jest -t "test pattern"
```

**Running End-to-End Tests**:

```bash
docker-compose exec backend npx jest --config jest-e2e.config.js
```

### Without Docker

**Run Unit Tests**:

```bash
cd backend
npm run test
```

**Run E2E Tests**:

```bash
cd backend
npm run test:e2e
```

## Additional Docker Commands

**Rebuilding containers after changes**:

```bash
docker-compose build backend
docker-compose build frontend
```

**Viewing logs**:

```bash
# View logs for all containers
docker-compose logs

# View logs for a specific container
docker-compose logs backend
docker-compose logs frontend

# Follow logs in real-time
docker-compose logs -f
```

**Stopping the application**:

```bash
docker-compose down
```

**Stopping and removing volumes (will delete database data)**:

```bash
docker-compose down -v
```
