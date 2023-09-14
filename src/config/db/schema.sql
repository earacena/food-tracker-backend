CREATE TYPE visibility AS ENUM ('private', 'public');

CREATE TABLE foodItem (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  foodName TEXT NOT NULL,
  userId uuid NOT NULL,
  caloriesPerServing INTEGER,
  servingSizeInGrams INTEGER,
  servingSizeInUnits INTEGER,
  searchVisibility visibility,
  createdAt timestampz DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE meal (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  userId uuid NOT NULL,
  name TEXT NOT NULL,
  createdAt timestampz DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE mealEntry (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  userId uuid NOT NULL,
  mealId INTEGER,
  foodItemId INTEGER,
  quantity INTEGER
);

CREATE TABLE profile (
  userId uuid PRIMARY KEY,
  dailyCalorieGoal INTEGER,
  createdAt timestampz DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE activity (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  userId uuid,
  mealId INTEGER,
  foodItemId: INTEGER,
  createdAt timestampz DEFAULT CURRENT_TIMESTAMP
);
