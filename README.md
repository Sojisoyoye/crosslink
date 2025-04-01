# crosslink

**To run the app**

- run:

`docker-compose up`

- For backend, cd into backend folder and run:

`npm run start:dev`

- For frontend, cd into frontend folder and run:

`npm run dev`

go to - http://localhost:5173/

*Swagger Documentation*

Visit http://localhost:3001/api to view the Swagger UI.

**Run migration**

- `npm run typeorm:migration:generate -n <FileName>`
- `npm run typeorm:migration:run`

**Seed Data**

`npm run seed`


## /auth/register 

*Example Request:*

```
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```
*Example response:*

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

*Run Unit Tests*

`npm run test`

*Run E2E Tests*

`npm run test:e2e`

