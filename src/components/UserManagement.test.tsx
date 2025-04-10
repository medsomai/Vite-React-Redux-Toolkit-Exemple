import { render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import UserManagement from "./UserManagement";
import usersReducer, { fetchUsers } from "../store/slices/usersSlice";
import authReducer from "../store/slices/authSlice";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

const mockUsers = [
  {
    id: "1",
    username: "admin",
    email: "admin@example.com",
    role: "admin",
    createdAt: "2024-03-15T10:00:00Z",
  },
  {
    id: "2",
    username: "user1",
    email: "user1@example.com",
    role: "user",
    createdAt: "2024-03-15T11:00:00Z",
  },
];

describe("UserManagement", () => {
  let store: ReturnType<typeof configureStore>;
  const initialState = {};

  beforeEach(() => {
    store = configureStore({
      reducer: {
        users: usersReducer,
        auth: authReducer,
      },
      preloadedState: {
        auth: {
          user: null,
          token: null,
          loading: false,
          error: null,
          ...initialState,
        },
      },
    });
  });

  it("renders loading state initially", () => {
    render(
      <Provider store={store}>
        <UserManagement />
      </Provider>
    );

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders users after loading", async () => {
    store.dispatch(fetchUsers.fulfilled(mockUsers, ""));

    render(
      <Provider store={store}>
        <UserManagement />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText("user1")).toBeInTheDocument();
      expect(screen.getByText("admin@example.com")).toBeInTheDocument();
      expect(screen.getByText("user1@example.com")).toBeInTheDocument();
    });
  });

  it("renders add user button", async () => {
    store.dispatch(fetchUsers.fulfilled(mockUsers, ""));

    render(
      <Provider store={store}>
        <UserManagement />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText("Add user")).toBeInTheDocument();
    });
  });
});
