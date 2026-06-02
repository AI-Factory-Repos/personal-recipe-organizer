# Personal Recipe Organizer

A web application for home cooks to organize and manage their personal recipe collections. Users can create accounts, add recipes with ingredients and cooking instructions, and organize them by cuisine type, meal category, and difficulty level.


> 📸 *Screenshot is captured automatically after the site finishes its first build.*

![Personal Recipe Organizer — Live Preview](https://s0.wordpress.com/mshots/v1/https%3A%2F%2Fpersonal-recipe-organizer.netlify.app?w=1200&h=630)

## Live Demo

[https://personal-recipe-organizer.netlify.app](https://personal-recipe-organizer.netlify.app)

## Features

- User authentication (register/login) with JWT tokens
- Create recipes with ingredients, instructions, cuisine type, meal category, and difficulty
- View all recipes in an organized dashboard grid
- Filter recipes by cuisine type, meal category (Breakfast/Lunch/Dinner), and difficulty (Easy/Medium/Hard)
- Sort recipes by title, creation date, or difficulty
- Edit and delete existing recipes
- Detailed recipe view with full instructions
- Responsive design for desktop and mobile

## Tech Stack

**Backend:**
- Node.js with Express.js
- MongoDB with Mongoose ODM
- JWT authentication
- bcryptjs for password hashing

**Frontend:**
- Vanilla HTML/CSS/JavaScript
- Hash-based SPA routing
- RESTful API integration

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or cloud service like MongoDB Atlas)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd personal-recipe-organizer
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your values:
```
MONGO_URI=mongodb://localhost:27017/recipe-organizer
JWT_SECRET=your-super-secret-jwt-key
PORT=5000
```

4. Start the backend server:
```bash
npm start
```

The application will be available at `http://localhost:5000`

## Project Structure

```
├── backend/
│   ├── config/db.js          # MongoDB connection
│   ├── middleware/auth.js    # JWT authentication middleware
│   ├── models/              # Mongoose models
│   │   ├── User.js
│   │   └── Recipe.js
│   ├── routes/              # API routes
│   │   ├── auth.js          # Authentication endpoints
│   │   └── recipes.js       # Recipe CRUD endpoints
│   ├── .env.example         # Environment variables template
│   ├── package.json
│   └── server.js            # Express server setup
├── frontend/
│   ├── css/main.css         # Styles
│   ├── js/
│   │   ├── auth.js          # Authentication utilities
│   │   └── router.js        # SPA routing
│   ├── pages/               # HTML pages
│   │   ├── login.html
│   │   ├── register.html
│   │   ├── dashboard.html
│   │   ├── create-recipe.html
│   │   ├── edit-recipe.html
│   │   └── recipe-detail.html
│   └── index.html           # Main entry point
└── netlify.toml             # Netlify deployment config
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/recipes` | Get all recipes (filtered by query params) |
| POST | `/api/recipes` | Create a new recipe |
| PUT | `/api/recipes/:id` | Update a recipe |
| DELETE | `/api/recipes/:id` | Delete a recipe |

### Query Parameters for GET /api/recipes

- `cuisine` - Filter by cuisine type (e.g., `Italian`, `Mexican`)
- `mealCategory` - Filter by meal category (`Breakfast`, `Lunch`, `Dinner`)
- `difficulty` - Filter by difficulty (`Easy`, `Medium`, `Hard`)

Example: `/api/recipes?cuisine=Italian&mealCategory=Dinner&difficulty=Easy`

## License

MIT