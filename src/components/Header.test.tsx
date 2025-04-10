import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import Header from "./Header";
import authReducer from "../store/slices/authSlice";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("Header", () => {
  const renderHeader = (initialState = {}) => {
    const store = configureStore({
      reducer: {
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

    render(
      <Provider store={store}>
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      </Provider>
    );
  };

  it("renders admin dashboard title for admin users", () => {
    renderHeader({
      user: { role: "admin" },
    });

    expect(screen.getByText("Admin Dashboard")).toBeInTheDocument();
  });

  it("renders product dashboard title for regular users", () => {
    renderHeader({
      user: { role: "user" },
    });

    expect(screen.getByText("Product Dashboard")).toBeInTheDocument();
  });

  it("handles logout correctly", () => {
    renderHeader({
      user: { role: "user" },
    });

    const logoutButton = screen.getByRole("button", { name: /logout/i });
    fireEvent.click(logoutButton);

    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });
});
