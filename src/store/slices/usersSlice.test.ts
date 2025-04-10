import { configureStore } from "@reduxjs/toolkit";
import usersReducer, {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../../store/slices/usersSlice";

jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe("usersSlice", () => {
  let store: any;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        users: usersReducer,
      },
    });
  });

  it("should handle initial state", () => {
    expect(store.getState().users).toEqual({
      users: [],
      loading: false,
      error: null,
    });
  });

  it("should handle fetchUsers", async () => {
    await store.dispatch(fetchUsers());
    const state = store.getState().users;

    expect(state.loading).toBe(false);
    expect(state.users.length).toBeGreaterThan(0);
    expect(state.error).toBeNull();
  });

  it("should handle createUser", async () => {
    const newUser = {
      username: "testuser",
      email: "test@example.com",
      role: "user",
    };

    await store.dispatch(createUser(newUser));
    const state = store.getState().users;

    expect(state.users).toHaveLength(1);
    expect(state.users[0].username).toBe(newUser.username);
  });

  it("should handle updateUser", async () => {
    // First create a user
    const initialUser = {
      username: "initialuser",
      email: "initial@example.com",
      role: "user",
    };
    await store.dispatch(createUser(initialUser));
    const userId = store.getState().users.users[0].id;

    // Then update it
    const updatedUser = {
      username: "updateduser",
      email: "updated@example.com",
      role: "admin",
    };
    await store.dispatch(updateUser({ id: userId, userData: updatedUser }));

    const state = store.getState().users;
    const user = state.users.find((u) => u.id === userId);

    expect(user.username).toBe(updatedUser.username);
    expect(user.email).toBe(updatedUser.email);
    expect(user.role).toBe(updatedUser.role);
  });

  it("should handle deleteUser", async () => {
    // First create a user
    const user = {
      username: "testuser",
      email: "test@example.com",
      role: "user",
    };
    await store.dispatch(createUser(user));
    const userId = store.getState().users.users[0].id;

    // Then delete it
    await store.dispatch(deleteUser(userId));
    const state = store.getState().users;

    expect(state.users).toHaveLength(0);
  });
});
