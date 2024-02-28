# Food Tracker Backend

## Description

The backend for a meal planning and calorie counting web application.

The frontend of this project is located [here](https://github.com/earacena/food-tracker.git).

### Technologies

#### Backend

- Typescript
- NodeJs
- ExpressJs
- Kysely
- Firebase Authentication
- Zod
- Docker

### Routes

#### /api/activities

| Method | Route                         | Behavior                                    |
|------  | ------                        | ------                                      |
| GET    | /api/activities/:id           | retrieves activity by id                    |
| GET    | /api/activities/user/:userId  | retrieves all activities with given userId  |
| POST   | /api/activities/              | creates an activity                         |
| DELETE | /api/activities/:id           | deletes activity with given id              |
| DELETE | /api/activities/meal/:mealId  | deletes activities with given mealId        |

#### /api/foodItems

| Method | Route                         | Behavior                                    |
|------  | ------                        | ------                                      |
| GET    | /api/foodItems/:id           | retrieves food item by id                    |
| GET    | /api/foodItems/user/:userId  | retrieves all food items with given userId   |
| POST   | /api/foodItems/              | creates an food item                         |
| PUT    | /api/foodItems/:id           | updates a food item with given id            |
| DELETE | /api/foodItems/:id           | deletes food item with given id              |

#### /api/mealEntries

| Method | Route                         | Behavior                                      |
|------  | ------                        | ------                                        |
| GET    | /api/mealEntries/:id          | retrieves meal entry by id                    |
| GET    | /api/mealEntries/meal/:mealId | retrieves all meal entries with given mealId  |
| GET    | /api/mealEntries/user/:userId | retrieves all meal entries with given userId  |
| POST   | /api/mealEntries/             | creates an meal entry                         |
| DELETE | /api/mealEntries/:id          | deletes meal entry with given id              |
| DELETE | /api/mealEntries/meal/:mealId | deletes meal entries with given mealId        |

#### /api/meals

| Method | Route                         | Behavior                                    |
|------  | ------                        | ------                                      |
| GET    | /api/meals/:id                | retrieves a meal by id                    |
| GET    | /api/meals/user/:userId       | retrieves all meals with given userId   |
| POST   | /api/meals/                   | creates an meal                         |
| PUT    | /api/meals/:id                | updates a meal with given id            |
| DELETE | /api/meals/:id                | deletes meal with given id              |

#### /api/profiles

| Method | Route                         | Behavior                                    |
|------  | ------                        | ------                                      |
| GET    | /api/profiles/:userId         | retrieves a profile by id                   |
| POST   | /api/profiles/                | creates an profile                          |
| PUT    | /api/profiles/:userId         | updates a profile with given id             |
| DELETE | /api/profiles/:userId         | deletes profile with given id               |

## Usage

### Download

First, clone the repository:

```bash
git clone https://github.com/earacena/food-tracker-backend.git
```

### Install dependencies

Inside the project folder, install the project dependencies using `npm`:

```bash
npm install
```

### Build

Inside the project folder, build the project using `tsc`:

```bash
npm run build
```

### Setup environment

The project uses Firebase for authentication, therefore your Firebase project service account must be downloaded and a .env file or environment variable with the path to the service account must be provided:

```text
GOOGLE_APPLICATION_CREDENTIALS= [path to service account file] ...
```

To test the backend and frontend together, an environment variable with the development [frontend](https://github.com/earacena/food-tracker.git) URL must be provided as well:

```text
CORS_ORIGIN= ...
```

### Deploy 

Ensure that the development database is running:

```bash
docker-compose -f docker-compose.yml up --build
```

Run the project locally:

```bash
npm run dev
```

### Clean up

Use `docker-compose` to shutdown the development database:

```bash
docker-compose -f docker-compose.yml down
```
