const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');
const { protect } = require('../middleware/auth');

// All recipe routes require authentication
router.use(protect);

// POST /api/recipes
router.post('/', async (req, res) => {
  const { title, ingredients, instructions, cuisineType, mealCategory, difficulty } = req.body;

  if (!title || !ingredients || !instructions) {
    return res.status(400).json({ message: 'Title, ingredients, and instructions are required' });
  }

  try {
    const recipe = await Recipe.create({
      title,
      ingredients,
      instructions,
      cuisineType: cuisineType || '',
      mealCategory: mealCategory || '',
      difficulty: difficulty || '',
      userId: req.user._id
    });
    res.status(201).json({ recipe });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/recipes
router.get('/', async (req, res) => {
  const { cuisine, mealCategory, difficulty } = req.query;
  const filter = { userId: req.user._id };

  if (cuisine) filter.cuisineType = cuisine;
  if (mealCategory) filter.mealCategory = mealCategory;
  if (difficulty) filter.difficulty = difficulty;

  try {
    const recipes = await Recipe.find(filter).sort({ createdAt: -1 });
    res.json({ recipes });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/recipes/:id
router.put('/:id', async (req, res) => {
  const { title, ingredients, instructions, cuisineType, mealCategory, difficulty } = req.body;

  try {
    const recipe = await Recipe.findOne({ _id: req.params.id, userId: req.user._id });
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
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
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/recipes/:id
router.delete('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
