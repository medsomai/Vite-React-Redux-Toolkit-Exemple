import { configureStore } from "@reduxjs/toolkit";
import authReducer, { login, logout } from "../../store/slices/authSlice";

describe("authSlice", () => {
  let store: any;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        auth: authReducer,
      },
    });
  });

  it("should handle initial state", () => {
    expect(store.getState().auth).toEqual({
      user: null,
      token: null,
      loading: false,
      error: null,
    });
  });

  it("should handle successful login", async () => {
    const credentials = {
      username: "testuser",
      password: "password123",
    };

    await store.dispatch(login(credentials));
    const state = store.getState().auth;

    expect(state.loading).toBe(false);
    expect(state.user).toBeTruthy();
    expect(state.token).toBeTruthy();
    expect(state.error).toBeNull();
  });

  it("should handle logout", () => {
    // First login
    store.dispatch(
      login({
        username: "testuser",
        password: "password123",
      })
    );

    // Then logout
    store.dispatch(logout());
    const state = store.getState().auth;

    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
  });
});
