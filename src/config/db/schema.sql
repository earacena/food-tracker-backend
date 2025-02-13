CREATE TYPE visibility AS ENUM ('private', 'public');

CREATE TABLE "foodItem" (
  "id" INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  "foodName" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "caloriesPerServing" INTEGER,
  "servingSizeInGrams" INTEGER,
  "servingSizeInUnits" INTEGER,
  "searchVisibility" visibility,
  "createdAt" timestamptz DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "meal" (
  "id" INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  "userId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "createdAt" timestamptz DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "mealEntry" (
  "id" INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  "userId" TEXT NOT NULL,
  "mealId" INTEGER,
  "foodItemId" INTEGER,
  "quantityInGrams" INTEGER,
  "quantityInUnits" INTEGER
);

CREATE TABLE "profile" (
  "userId" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "dailyCalorieGoal" INTEGER,
  "createdAt" timestamptz DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "activity" (
  "id" INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  "userId" TEXT NOT NULL,
  "mealId" INTEGER,
  "foodItemId" INTEGER,
  "quantityInGrams" INTEGER,
  "quantityInUnits" INTEGER,
  "createdAt" timestamptz DEFAULT CURRENT_TIMESTAMP
);
