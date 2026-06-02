const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    ingredients: {
      type: [String],
      required: [true, 'Ingredients are required'],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: 'At least one ingredient is required'
      }
    },
    instructions: {
      type: String,
      required: [true, 'Instructions are required'],
      trim: true
    },
    cuisineType: {
      type: String,
      trim: true,
      default: ''
    },
    mealCategory: {
      type: String,
      trim: true,
      default: ''
    },
    difficulty: {
      type: String,
      enum: {
        values: ['Easy', 'Medium', 'Hard', ''],
        message: 'Difficulty must be Easy, Medium, or Hard'
      },
      default: ''
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required']
    }
  },
  {
    timestamps: true
  }
);

// Index for efficient user-based queries with filters
recipeSchema.index({ userId: 1, cuisineType: 1, mealCategory: 1, difficulty: 1 });

module.exports = mongoose.model('Recipe', recipeSchema);
