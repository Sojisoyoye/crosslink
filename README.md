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

`npm run typeorm:migration:generate -n <FileName>`
`npm run typeorm:migration:run`

**Seed Data**

`npm run seed`