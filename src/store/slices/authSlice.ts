import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type {
  AuthState,
  LoginCredentials,
  ResetPasswordRequest,
  UpdatePasswordRequest,
} from "../../types";

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("token"),
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  "auth/login",
  async (credentials: LoginCredentials) => {
    // Simulate API call
    const response = await new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          user: {
            id: "1",
            username: credentials.username,
            email: "user@example.com",
            role: credentials.username === "admin" ? "admin" : "user",
            createdAt: new Date().toISOString(),
          },
          token: "fake-jwt-token",
        });
      }, 1000);
    });
    return response;
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (data: ResetPasswordRequest) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { message: "Reset password email sent" };
  }
);

export const updatePassword = createAsyncThunk(
  "auth/updatePassword",
  async (data: UpdatePasswordRequest) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { message: "Password updated successfully" };
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Login failed";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
