# Tournament Registration API

A REST API to manage trading card game tournaments hosted by local game stores, built with **Node.js**, **Express** and **MongoDB**.

Many local stores still organize tournaments on paper or in group chats. This API lets a store publish its tournaments, keep them up to date and remove them, with every tournament linked to the store that hosts it. It is the first module of a larger project, **TCG Local Radar**, an app to find stores, tournaments and players nearby.

## Features

- Full CRUD for tournaments: create, read, update and delete
- Search by name and filter by game, combinable
- Tournaments reference their store, returned with name, city and address
- Data validation in the Mongoose schema (required fields, allowed games, minimum players, integer and non-negative values)
- Centralized error handling with a clear JSON message and a specific status code for every case
- Only allowed fields are accepted from request bodies

## Tech stack

- Node.js 24
- Express 5
- MongoDB Atlas
- Mongoose
- ES Modules (`import` / `export`)

## Getting started

### Prerequisites

- Node.js 24 or later (required for `RegExp.escape` and the built-in `--env-file` option)
- A MongoDB database, for example a free cluster on MongoDB Atlas

### Installation

```bash
git clone https://github.com/simonesbds/tournament-registration-api.git
cd tournament-registration-api
npm install
```

### Environment variables

Create a `.env` file in the project root:

```
PORT=3000
MONGODB_URI=your-mongodb-connection-string
```

The connection string must include the database name after `.mongodb.net/`, otherwise MongoDB uses a default database called `test`.

### Running the server

```bash
npm run dev    # development mode, restarts on file changes
npm start      # standard mode
```

The server starts only after the database connection succeeds, and exits with an error if the connection fails.

Stores are currently managed directly in the database: create them in the `stores` collection before creating tournaments.

## API endpoints

Base URL: `http://localhost:3000/api/tournaments`

| Method | Endpoint | Description | Success |
| ------ | -------- | ----------- | ------- |
| GET | `/` | List all tournaments, sorted by date | `200` |
| GET | `/?name=` | Case-insensitive search by name (partial match) | `200` |
| GET | `/?game=` | Filter by game (case-insensitive, exact match) | `200` |
| GET | `/:id` | Get a single tournament | `200` |
| POST | `/` | Create a tournament | `201` |
| PATCH | `/:id` | Update only the fields sent | `200` |
| DELETE | `/:id` | Delete a tournament | `204` (no content) |

Filters can be combined, for example `/?name=night&game=magic`. A search with no results returns `200` with an empty array.

### Error responses

Every error returns a JSON object with a `message`:

```json
{ "message": "Tournament not found" }
```

| Status | When |
| ------ | ---- |
| `400` | Invalid id format, data that breaks the schema rules, wrong value types, a reference to a store that does not exist, or no valid fields in an update |
| `404` | No tournament exists with the id in the URL |
| `500` | Unexpected server error |

### Example: create a tournament

`POST /api/tournaments`

```json
{
  "name": "Sealed Draft Night",
  "game": "Magic",
  "date": "2026-12-19T20:00:00Z",
  "maxPlayers": 8,
  "store": "6af269f7482de6ad0377fa7d"
}
```

Response `201`: the created tournament. `entryFee` defaults to `0` when not provided.

### Example: get a tournament

`GET /api/tournaments/6aefc544482de6ad0377fa5e`

```json
{
  "_id": "6aefc544482de6ad0377fa5e",
  "name": "Friday Night Magic",
  "game": "Magic",
  "date": "2026-11-20T20:30:00.000Z",
  "maxPlayers": 16,
  "entryFee": 5,
  "store": {
    "_id": "6af269f7482de6ad0377fa7d",
    "name": "Il Covo del Drago",
    "city": "Pescara",
    "address": "Via Nicola Fabrizi 112"
  }
}
```

### Example: update a tournament

`PATCH /api/tournaments/6aefc544482de6ad0377fa5e`

```json
{ "maxPlayers": 24 }
```

Response `200`: the updated tournament. Fields not sent are left unchanged.

## Data model

### Tournament

| Field | Type | Required | Rules |
| ----- | ---- | -------- | ----- |
| `name` | String | Yes | Trimmed |
| `game` | String | Yes | One of `Magic`, `Pokemon`, `Yu-Gi-Oh`, `One Piece` |
| `date` | Date | Yes | ISO 8601 format |
| `maxPlayers` | Number | Yes | Integer, at least 2 |
| `entryFee` | Number | No | At least 0, defaults to 0 |
| `store` | ObjectId | Yes | Reference to an existing store |

`createdAt` and `updatedAt` are added automatically.

### Store

| Field | Type | Required |
| ----- | ---- | -------- |
| `name` | String | Yes |
| `city` | String | Yes |
| `address` | String | Yes |

## Project structure

```
tournament-registration-api/
├── config/
│   └── db.js                    # MongoDB connection
├── controllers/
│   └── tournamentController.js  # request handling logic
├── middleware/
│   └── errorHandler.js          # centralized error handling
├── models/
│   ├── Store.js
│   └── Tournament.js            # schema and validation rules
├── routes/
│   └── tournamentRoutes.js      # tournament endpoints (Express Router)
├── utils/
│   └── errors.js                # custom error classes
├── server.js                    # app setup and entry point
└── package.json
```

## What I learned

- Designing a REST API with full CRUD and meaningful status codes
- Modeling related data with references and `populate`
- Keeping validation rules in the schema as a single source of truth
- Protecting the database by accepting only allowed fields
- Escaping user input used in regular expressions
- Centralizing error handling with custom error classes and an Express error middleware
- Writing small, descriptive commits with Conventional Commits

## Next steps

- [ ] Filter tournaments by store and by date (past or upcoming)
- [ ] Player registrations, with rules for full tournaments, past tournaments and duplicate sign-ups
- [ ] Authentication, so only store owners can manage their tournaments
- [ ] Automated tests
- [ ] Pagination for large result sets
