import { createSlice } from '@reduxjs/toolkit';
import { createOrder, getAllOrders, getOrderById, getOrdersByUserId, updateOrder, deleteOrderById } from '../actions/order';

// Initial state for the order slice
const initialState = {
  order: {
    user_id: null,
    restaurant_id: null,
    delivery_address: '',
    total_price: 0,
    payment_info_id: null
  },
  orderItems: [],
  status: 'idle',
  error: null
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    addOrderItem: (state, action) => {
        const item = action.payload;
        const existingItemIndex = state.orderItems.findIndex(i => i.item_id.$oid === item.item_id.$oid);

        if (existingItemIndex !== -1) {
            // If the item already exists in the cart, update its quantity and subtotal
            state.orderItems[existingItemIndex].quantity += item.quantity;
            state.orderItems[existingItemIndex].subtotal += item.subtotal;
        } else {
            // If the item is new, add it to the orderItems array
            state.orderItems.push(item);
        }

        // Update the total price of the order
        state.order.total_price += item.subtotal;
    },
    removeOrderItem: (state, action) => {
      const itemId = action.payload;
      const itemIndex = state.orderItems.findIndex(item => item._id.$oid === itemId);
      if (itemIndex !== -1) {
        state.order.total_price -= state.orderItems[itemIndex].subtotal;
        state.orderItems.splice(itemIndex, 1);
      }
    },
    updateOrderItem: (state, action) => {
      const updatedItem = action.payload;
      const itemIndex = state.orderItems.findIndex(item => item._id.$oid === updatedItem._id.$oid);
      if (itemIndex !== -1) {
        state.order.total_price -= state.orderItems[itemIndex].subtotal;
        state.orderItems[itemIndex] = updatedItem;
        state.order.total_price += updatedItem.subtotal;
      }
    },
    clearOrder: (state) => {
      state.order = initialState.order;
      state.orderItems = [];
    }
    // Additional reducers can be added here
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.fulfilled, (state, action) => {
        state.order = action.payload;
      })
      .addCase(getAllOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
      })
      .addCase(getOrderById.fulfilled, (state, action) => {
        state.order = action.payload;
      })
      .addCase(getOrdersByUserId.fulfilled, (state, action) => {
        state.orders = action.payload;
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        state.order = action.payload;
      })
      .addCase(deleteOrderById.fulfilled, (state, action) => {
        state.orders = state.orders.filter(order => order._id !== action.payload._id);
      });
    // Additional reducers for orderHistory can be added here
  }
});

export const { addOrderItem, removeOrderItem, updateOrderItem, clearOrder } = orderSlice.actions;

export default orderSlice.reducer;
