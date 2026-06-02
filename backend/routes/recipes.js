const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');
const auth = require('../middleware/auth');

// All routes require authentication
router.use(auth);

// POST /api/recipes — Create a new recipe
router.post('/', async (req, res) => {
  try {
    const { title, ingredients, instructions, cuisineType, mealCategory, difficulty } = req.body;

    const recipe = new Recipe({
      title,
      ingredients,
      instructions,
      cuisineType,
      mealCategory,
      difficulty,
      userId: req.user.id
    });

    await recipe.save();
    res.status(201).json({ recipe });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ error: messages.join(', ') });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/recipes — List user's recipes with optional filters
router.get('/', async (req, res) => {
  try {
    const { cuisine, mealCategory, difficulty } = req.query;

    const filter = { userId: req.user.id };

    if (cuisine) filter.cuisineType = cuisine;
    if (mealCategory) filter.mealCategory = mealCategory;
    if (difficulty) filter.difficulty = difficulty;

    const recipes = await Recipe.find(filter).sort({ createdAt: -1 });
    res.json({ recipes });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/recipes/:id — Update a recipe
router.put('/:id', async (req, res) => {
  try {
    const { title, ingredients, instructions, cuisineType, mealCategory, difficulty } = req.body;

    const recipe = await Recipe.findOne({ _id: req.params.id, userId: req.user.id });
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    if (title !== undefined) recipe.title = title;
    if (ingredients !== undefined) recipe.ingredients = ingredients;
    if (instructions !== undefined) recipe.instructions = instructions;
    if (cuisineType !== undefined) recipe.cuisineType = cuisineType;
    if (mealCategory !== undefined) recipe.mealCategory = mealCategory;
    if (difficulty !== undefined) recipe.difficulty = difficulty;

    await recipe.save();
    res.json({ recipe });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ error: messages.join(', ') });
    }
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/recipes/:id — Delete a recipe
router.delete('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    res.json({ success: true });
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
