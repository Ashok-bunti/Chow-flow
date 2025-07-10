import userModel from "../models/userModel.js";

// Service for cart operations
const cartService = {
  // Add item to user cart
  async addToCart(userId, itemId) {
    let userData = await userModel.findOne({ _id: userId });
    let cartData = await userData.cartData;
    
    if (!cartData[itemId]) {
      cartData[itemId] = 1;
    } else {
      cartData[itemId] += 1;
    }
    
    await userModel.findByIdAndUpdate(userId, { cartData });
    return { success: true, message: "Added To Cart" };
  },

  // Remove item from user cart
  async removeFromCart(userId, itemId) {
    let userData = await userModel.findById(userId);
    let cartData = await userData.cartData;
    
    if (cartData[itemId] > 0) {
      cartData[itemId] -= 1;
    }
    
    await userModel.findByIdAndUpdate(userId, { cartData });
    return { success: true, message: "Removed From Cart" };
  },

  // Get user cart data
  async getCart(userId) {
    let userData = await userModel.findById(userId);
    let cartData = await userData.cartData;
    return { success: true, cartData: cartData };
  }
};

export default cartService;