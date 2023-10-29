import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const createOrder = createAsyncThunk('order/createOrder', async (orderData) => {
  const response = await axios.post("/orders/create", orderData);
  return response.data;
});

export const getAllOrders = createAsyncThunk('order/getAllOrders', async () => {
  const response = await axios.get("/orders/");
  return response.data;
});

export const getOrderById = createAsyncThunk('order/getOrderById', async (orderId) => {
  const response = await axios.get(`/orders/${orderId}`);
  return response.data;
});

export const getOrdersByUserId = createAsyncThunk('order/getOrdersByUserId', async (userId) => {
  const response = await axios.get(`/orders/user/${userId}`);
  return response.data;
});

export const updateOrder = createAsyncThunk('order/updateOrder', async ({ orderId, orderData }) => {
  const response = await axios.put(`/orders/update/${orderId}`, orderData);
  return response.data;
});

export const deleteOrderById = createAsyncThunk('order/deleteOrderById', async (orderId) => {
  const response = await axios.delete(`/orders/delete/${orderId}`);
  return response.data;
});

// Additional actions for orderHistory can be added similarly
