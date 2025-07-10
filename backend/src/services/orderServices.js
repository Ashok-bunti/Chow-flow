import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Config variables
const currency = "inr";
const deliveryCharge = 50;
const frontend_URL = 'http://localhost:5173';

const orderService = {
  // Place order with payment via Stripe
  async placeOrder(orderData) {
    const newOrder = new orderModel({
      userId: orderData.userId,
      items: orderData.items,
      amount: orderData.amount,
      address: orderData.address,
    });
    
    await newOrder.save();
    await userModel.findByIdAndUpdate(orderData.userId, { cartData: {} });

    const line_items = orderData.items.map((item) => ({
      price_data: {
        currency: currency,
        product_data: {
          name: item.name
        },
        unit_amount: item.price * 100
      },
      quantity: item.quantity
    }));

    line_items.push({
      price_data: {
        currency: currency,
        product_data: {
          name: "Delivery Charge"
        },
        unit_amount: deliveryCharge * 100
      },
      quantity: 1
    });

    const session = await stripe.checkout.sessions.create({
      success_url: `${frontend_URL}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_URL}/verify?success=false&orderId=${newOrder._id}`,
      line_items: line_items,
      mode: 'payment',
    });

    return { success: true, session_url: session.url };
  },

  // Place order with Cash on Delivery
  async placeOrderCod(orderData) {
    const newOrder = new orderModel({
      userId: orderData.userId,
      items: orderData.items,
      amount: orderData.amount,
      address: orderData.address,
      payment: true,
    });
    
    await newOrder.save();
    await userModel.findByIdAndUpdate(orderData.userId, { cartData: {} });

    return { success: true, message: "Order Placed" };
  },

  // Get all orders (for admin)
  async listOrders() {
    const orders = await orderModel.find({});
    return { success: true, data: orders };
  },

  // Get orders for a specific user
  async userOrders(userId) {
    const orders = await orderModel.find({ userId: userId });
    return { success: true, data: orders };
  },

  // Update order status
  async updateStatus(orderId, status) {
    await orderModel.findByIdAndUpdate(orderId, { status: status });
    return { success: true, message: "Status Updated" };
  },

  // Verify payment status of an order
  async verifyOrder(orderId, paymentSuccess) {
    if (paymentSuccess === "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      return { success: true, message: "Paid" };
    } else {
      await orderModel.findByIdAndDelete(orderId);
      return { success: false, message: "Not Paid" };
    }
  }
};

export default orderService;