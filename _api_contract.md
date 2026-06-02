# Backend API Contract

This file was generated automatically by AI Factory after the backend phase completed.
**Frontend agents MUST use these exact paths, methods, and payload shapes.**
Do not invent or guess endpoint paths — use only what is listed here.

## Endpoint Summary

| Method | Path | Description |
| ------ | ---- | ----------- |
| `POST` | `/api/auth/register` | Register a new user and return a JWT token |
| `POST` | `/api/auth/login` | Authenticate an existing user and return a JWT token |
| `POST` | `/api/recipes` | Create a new recipe for the authenticated user |
| `GET` | `/api/recipes` | List all recipes for the authenticated user with optional filters |
| `PUT` | `/api/recipes/:id` | Update an existing recipe owned by the authenticated user |
| `DELETE` | `/api/recipes/:id` | Delete a recipe owned by the authenticated user |
| `POST` | `/api/auth/register` | Register a new user with bcrypt password hashing and return a JWT token |
| `POST` | `/api/auth/login` | Authenticate a user with bcrypt password comparison and return a JWT token |
| `POST` | `/api/recipes` | Create a new recipe for the authenticated user |
| `GET` | `/api/recipes` | List all recipes for the authenticated user; supports optional filtering |
| `PUT` | `/api/recipes/:id` | Update an existing recipe owned by the authenticated user |
| `DELETE` | `/api/recipes/:id` | Delete a recipe owned by the authenticated user |

## Endpoint Details

### `POST /api/auth/register`
Register a new user and return a JWT token

**Request body:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "token": "string",
  "user": {
    "id": "string",
    "username": "string",
    "email": "string"
  }
}
```

### `POST /api/auth/login`
Authenticate an existing user and return a JWT token

**Request body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "token": "string",
  "user": {
    "id": "string",
    "username": "string",
    "email": "string"
  }
}
```

### `POST /api/recipes`
Create a new recipe for the authenticated user

**Request body:**
```json
{
  "title": "string",
  "ingredients": [
    "string"
  ],
  "instructions": "string",
  "cuisineType": "string",
  "mealCategory": "string",
  "difficulty": "string"
}
```

**Response:**
```json
{
  "recipe": {}
}
```

### `GET /api/recipes`
List all recipes for the authenticated user with optional filters

**Response:**
```json
{
  "recipes": []
}
```

### `PUT /api/recipes/:id`
Update an existing recipe owned by the authenticated user

**Request body:**
```json
{
  "title": "string",
  "ingredients": [
    "string"
  ],
  "instructions": "string",
  "cuisineType": "string",
  "mealCategory": "string",
  "difficulty": "string"
}
```

**Response:**
```json
{
  "recipe": {}
}
```

### `DELETE /api/recipes/:id`
Delete a recipe owned by the authenticated user

**Response:**
```json
{
  "success": true
}
```

### `POST /api/auth/register`
Register a new user with bcrypt password hashing and return a JWT token

**Request body:**
```json
{
  "username": "string (min 3 chars, required)",
  "email": "string (valid email, required)",
  "password": "string (min 6 chars, required)"
}
```

**Response:**
```json
{
  "token": "string (JWT, 7d expiry)",
  "user": {
    "id": "string",
    "username": "string",
    "email": "string"
  }
}
```

### `POST /api/auth/login`
Authenticate a user with bcrypt password comparison and return a JWT token

**Request body:**
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Response:**
```json
{
  "token": "string (JWT, 7d expiry)",
  "user": {
    "id": "string",
    "username": "string",
    "email": "string"
  }
}
```

### `POST /api/recipes`
Create a new recipe for the authenticated user

**Request body:**
```json
{
  "title": "string (required)",
  "ingredients": "string[] (required, min 1)",
  "instructions": "string (required)",
  "cuisineType": "string (required) \u2014 enum: Italian|Mexican|Chinese|Indian|American|French|Japanese|Mediterranean|Thai|Other",
  "mealCategory": "string (required) \u2014 enum: Breakfast|Lunch|Dinner|Snack|Dessert|Appetizer|Beverage",
  "difficulty": "string (required) \u2014 enum: Easy|Medium|Hard"
}
```

**Response:**
```json
{
  "recipe": {}
}
```

### `GET /api/recipes`
List all recipes for the authenticated user; supports optional filtering

**Response:**
```json
{
  "recipes": []
}
```

### `PUT /api/recipes/:id`
Update an existing recipe owned by the authenticated user

**Request body:**
```json
{
  "title": "string (optional)",
  "ingredients": "string[] (optional)",
  "instructions": "string (optional)",
  "cuisineType": "string (optional) \u2014 enum: Italian|Mexican|Chinese|Indian|American|French|Japanese|Mediterranean|Thai|Other",
  "mealCategory": "string (optional) \u2014 enum: Breakfast|Lunch|Dinner|Snack|Dessert|Appetizer|Beverage",
  "difficulty": "string (optional) \u2014 enum: Easy|Medium|Hard"
}
```

**Response:**
```json
{
  "recipe": {}
}
```

### `DELETE /api/recipes/:id`
Delete a recipe owned by the authenticated user

**Response:**
```json
{
  "success": true
}
```
