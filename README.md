### Concerts finder

If you are looking for the answers regarding scalability, please take a look at `scalability.md`

### Installation

Recommended Node.js version: `12.16+` (install it using `nvm` if needed)
The application uses Typescript + NestJs.

`npm install`

### Api

```
GET /api/concerts?bandIds=..&latitude=..&longitude=..&radius=..

bandIds: String - Comma separated list of bandIds
latitude: float
longitude: float
radius: Int - In kilometers

Validation: bandIds AND/OR latitude/longitude/radius

Returns a list of concerts ordered by descending date:
[
    {
        "band": string,
        "location": string,
        "date": bigint,
        "latitude": float,
        "longitude": float
    }
    ...
]

```

Example:

```
GET /api/concerts?bandIds=64,3,2&longitude=-79.5121349&latitude=43.6818538&radius=100

Response:
    status: 200
    body: [
        {
            "date": "1571808436512",
            "band": "3OH!3",
            "location": "Rivoli, Toronto, ON, Canada",
            "latitude": 43.64944970000001,
            "longitude": -79.3949696
        },
        {
            "date": "1559108692447",
            "band": "Arkells",
            "location": "The Garrison, Toronto, ON, Canada",
            "latitude": 43.6492659,
            "longitude": -79.42233209999999
        },
        {
            "date": "1550266041260",
            "band": "4 Non Blondes",
            "location": "Sony Centre for the Performing Arts, Toronto, ON, Canada",
            "latitude": 43.6466723,
            "longitude": -79.3760205
        },
        ...
    ]

```

In case of invalid query params (missing or unexpected type), a 400 error is returned:

```
GET /api/concerts?bandIds=64,3,2&longitude=-79.5121349&latitude=true8&radius=100

Response:
    status: 400
    body: {
        statusCode: 400,
        error: 'Bad Request',
        message: 'Validation failed',
    }
```

In case of a failure while querying the database, a 500 error is returned:

```
GET /api/concerts?bandIds=64,3,2

Response:
    status: 500
    body: {
        statusCode: 500,
        message: 'Internal Server Error',
    }
```

### Running

1) This application depends on a postgresql database with postgis extensions installed, so you can start a local docker container with:
`docker run --name some-postgis -e POSTGRES_PASSWORD=mysecretpassword -p 5432:5432 -d postgis/postgis`

2) We need to create db schemas, tables, etc...
Do so with `npm run typeorm schema:sync`

3) Let's import the provided data into the created tables! (might take a while :) )
`npm run typeorm migration:run`

4) At last, you should be able to start the application itself with: `npm run start`

### Testing
`npm test` to run the test suite.

`npm run test:cov` to also generate code coverage.

### Things missing
* End to end testing with a database
* Writting tests for the migration script
* Swagger integration
* Dabase schema is missing some constrains (not null, handling cascade changes)