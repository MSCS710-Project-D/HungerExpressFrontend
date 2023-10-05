import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

const base_url = "https://us-central1-maristhungerexpress.cloudfunctions.net/api"

// Asynchronous thunk for logging in
export const loginUserAsync = createAsyncThunk(
    'auth/loginUserAsync',
    async (credentials, thunkAPI) => {
        const { email, password } = credentials;
        try {
            const response = await axios.post(`${base_url}/user/login`, {
                email,
                password: password
            });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Error logging in.");
        }
    }
);

// For Signup
export const signupUserAsync = createAsyncThunk(
    'auth/signupUserAsync',
    async (credentials, thunkAPI) => {
        const { email, password, firstName, lastName } = credentials;
        try {
            const response = await axios.post(`${base_url}/user/create`, {
                email,
                password: password,
                firstName,
                lastName
            });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Error signing up.");
        }
    }
);

// For Forgot Password
export const forgotPasswordAsync = createAsyncThunk(
    'auth/forgotPasswordAsync',
    async (email, thunkAPI) => {
        try {
            const response = await axios.post(`${base_url}/user/forgot-password`, {
                email
            });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Error sending reset link.");
        }
    }
);