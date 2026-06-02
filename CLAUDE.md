# Personal Recipe Organizer

## Project Overview

The Personal Recipe Organizer is a web application that allows home cooks to create, organize, and manage their personal recipe collections. Users can create accounts, add recipes with detailed information (ingredients, instructions, cuisine type, meal category, difficulty), and filter their recipes for easy organization. This is a private, personal recipe management tool rather than a community sharing platform.

## Tech Stack

**Backend:**
- Node.js with Express.js framework
- MongoDB database with Mongoose ODM
- JSON Web Tokens (JWT) for authentication
- bcrypt for password hashing
- Express middleware for CORS, JSON parsing, and authentication
- Input validation libraries

**Frontend:**
- Vanilla HTML/CSS/JavaScript (no framework)
- Client-side routing with JavaScript
- Local storage for JWT token persistence
- Fetch API for HTTP requests
- Responsive CSS design

**Deployment:**
- Frontend: Netlify
- Backend: (inferred from Express setup, likely Heroku/Railway/similar)

## Architecture

The application follows a traditional client-server architecture with REST API communication:

**Backend Structure:**
- `/models/` - Mongoose schemas for User and Recipe
- `/routes/` - Express route handlers for auth and recipes
- `/middleware/` - JWT authentication middleware
- `/config/` - Database connection configuration
- `server.js` - Main Express application entry point

**Frontend Structure:**
- `/pages/` - HTML files for each route (login, register, dashboard, create, edit)
- `/js/` - JavaScript modules for routing, API calls, and page logic
- `/css/` - Stylesheets for layout and responsive design
- `index.html` - Main entry point with client-side routing

**Communication:**
- REST API endpoints for all data operations
- JWT tokens sent in Authorization headers
- JSON request/response format throughout

## Build & Development Commands

**Backend:**
```bash
npm install
npm run dev          # Start development server with nodemon
npm start           # Start production server
```

**Frontend:**
```bash
# No build process required - static files served directly
# For development, serve files with any static server:
npx serve .         # or python -m http.server, etc.
```

## Environment Variables

```env
# Backend
MONGODB_URI=mongodb://localhost:27017/recipe-organizer
JWT_SECRET=your-super-secret-jwt-signing-key
PORT=3000
NODE_ENV=development

# Frontend (if using environment-specific API URLs)
API_BASE_URL=http://localhost:3000/api
```

## API Endpoints

| Method | Path | Description | Auth Required |
|--------|------|-------------|---------------|
| POST | `/api/auth/register` | Create new user account | No |
| POST | `/api/auth/login` | User login with credentials | No |
| POST | `/api/recipes` | Create new recipe | Yes |
| GET | `/api/recipes` | Get all recipes for authenticated user | Yes |
| PUT | `/api/recipes/:id` | Update specific recipe | Yes |
| DELETE | `/api/recipes/:id` | Delete specific recipe | Yes |

## Database Schema

**User Model:**
- `_id` (ObjectId) - Primary key
- `username` (String, required, unique) - User's display name
- `email` (String, required, unique) - User's email address
- `passwordHash` (String, required) - bcrypt hashed password
- `createdAt` (Date) - Account creation timestamp

**Recipe Model:**
- `_id` (ObjectId) - Primary key
- `title` (String, required) - Recipe name
- `ingredients` (Array of Strings, required) - List of ingredients
- `instructions` (String, required) - Cooking instructions
- `cuisineType` (String, required) - Cuisine category
- `mealCategory` (String, enum: ['Breakfast', 'Lunch', 'Dinner'], required)
- `difficulty` (String, enum: ['Easy', 'Medium', 'Hard'], required)
- `userId` (ObjectId, ref: 'User', required) - Owner reference
- `createdAt` (Date) - Recipe creation timestamp
- `updatedAt` (Date) - Last modification timestamp

## Key Algorithms & Patterns

**Authentication Flow:**
- Registration: bcrypt hashes password → store user → return JWT
- Login: validate credentials → compare bcrypt hash → return JWT
- Protected routes: middleware extracts JWT → verifies signature → attaches user to request

**Client-Side Routing:**
- Hash-based routing system that shows/hides page sections
- Route guards check for JWT token in localStorage before accessing protected pages
- Automatic redirect to login if token missing or expired

**Recipe Filtering:**
- Client-side filtering using JavaScript array methods
- Maintains filter state in memory while user navigates
- "All" option for each filter category resets that specific filter

**State Management:**
- JWT stored in localStorage for persistence across browser sessions
- Recipe data fetched fresh on dashboard load
- Form data cleared after successful submissions

## What Was Built (Tickets)

**Phase 1 - Foundation**
- **BE-1**: Set up backend project and database models — Created Express.js server with MongoDB connection and defined User/Recipe Mongoose schemas
- **BE-2**: Implement user authentication endpoints — Added registration and login endpoints with bcrypt hashing, JWT generation, and auth middleware
- **FE-1**: Set up frontend project structure and routing — Built HTML/CSS/JS foundation with client-side routing between all pages

**Phase 2 - Core**
- **BE-3**: Create recipe CRUD API endpoints — Implemented all authenticated recipe endpoints (create, read, update, delete) with validation
- **FE-2**: Build login and register forms — Created authentication forms with validation, JWT storage, and error handling
- **FE-3**: Build recipe creation form — Built dynamic recipe form with ingredients list, dropdowns for categories, and validation
- **FE-4**: Build recipe dashboard with listing — Created main dashboard that displays recipes in grid layout with basic styling

**Phase 3 - Integration**
- **FE-5**: Integrate recipe creation with backend API — Connected recipe form to POST endpoint with proper error handling
- **FE-6**: Integrate recipe dashboard with backend API — Connected dashboard to GET endpoint with loading/empty/error states
- **FE-7**: Add filtering and sorting to recipe dashboard — Added client-side filtering dropdowns for cuisine, meal category, and difficulty
- **FE-8**: Build recipe edit form and detail view — Created recipe detail page and edit form with pre-populated data
- **FE-9**: Integrate recipe edit and delete functionality — Connected edit/delete to PUT/DELETE endpoints with confirmation dialogs

**Phase 4 - Polish**
- **FE-10**: Add authentication guards and logout functionality — Implemented route protection, logout functionality, and token expiration handling

## Known Constraints & Notes

**Technical Decisions:**
- Vanilla JavaScript chosen over frameworks for simplicity and minimal dependencies
- Client-side filtering instead of server-side for better performance with small datasets
- Hash-based routing to avoid server configuration for SPAs

**Security Considerations:**
- JWT tokens stored in localStorage (vulnerable to XSS but simpler than httpOnly cookies)
- No password strength requirements implemented in MVP
- Recipe access is user-scoped but no additional permission layers

**Data Limitations:**
- No image upload capability for recipes
- Ingredients stored as simple string array (no quantities/measurements structure)
- No recipe sharing or export functionality

**Deployment Notes:**
- Frontend deployed as static files on Netlify
- Environment variables needed for API endpoint configuration
- CORS configured for cross-origin requests between frontend and backend domains

**Future Considerations:**
- Database indexes not optimized for larger user bases
- No pagination implemented for recipe lists
- Search functionality not implemented but filtering provides basic discovery