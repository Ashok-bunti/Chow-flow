import foodModel from "../models/foodModel.js";
import fs from 'fs';

// Service for food operations
const foodService = {
  // Get all food items
  async listFood() {
    const foods = await foodModel.find({});
    return { success: true, data: foods };
  },

  // Add a new food item
  async addFood(foodData, filename) {
    const food = new foodModel({
      name: foodData.name,
      description: foodData.description,
      price: foodData.price,
      category: foodData.category,
      image: filename,
    });

    await food.save();
    return { success: true, message: "Food Added" };
  },

  // Remove a food item
  async removeFood(id) {
    const food = await foodModel.findById(id);
    fs.unlink(`uploads/${food.image}`, () => {});
    
    await foodModel.findByIdAndDelete(id);
    return { success: true, message: "Food Removed" };
  }
};

export default foodService;