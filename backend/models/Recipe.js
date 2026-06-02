const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true
    },
    ingredients: {
      type: [String],
      required: [true, 'Ingredients are required'],
      validate: {
        validator: (arr) => arr.length > 0,
        message: 'At least one ingredient is required'
      }
    },
    instructions: {
      type: String,
      required: [true, 'Instructions are required']
    },
    cuisineType: {
      type: String,
      required: [true, 'Cuisine type is required'],
      enum: {
        values: ['Italian', 'Mexican', 'Chinese', 'Indian', 'American', 'French', 'Japanese', 'Mediterranean', 'Thai', 'Other'],
        message: '{VALUE} is not a valid cuisine type'
      }
    },
    mealCategory: {
      type: String,
      required: [true, 'Meal category is required'],
      enum: {
        values: ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert', 'Appetizer', 'Beverage'],
        message: '{VALUE} is not a valid meal category'
      }
    },
    difficulty: {
      type: String,
      required: [true, 'Difficulty is required'],
      enum: {
        values: ['Easy', 'Medium', 'Hard'],
        message: '{VALUE} is not a valid difficulty level'
      }
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Recipe', recipeSchema);
