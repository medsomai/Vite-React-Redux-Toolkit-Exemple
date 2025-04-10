import { render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import ProductManagement from "./ProductManagement";
import productsReducer, { fetchProducts } from "../store/slices/productsSlice";
import authReducer from "../store/slices/authSlice";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

const mockProducts = [
  {
    id: "1",
    name: "Test Product 1",
    description: "Test Description 1",
    price: 99.99,
    createdAt: "2024-03-15T10:00:00Z",
  },
  {
    id: "2",
    name: "Test Product 2",
    description: "Test Description 2",
    price: 149.99,
    createdAt: "2024-03-15T11:00:00Z",
  },
];

describe("ProductManagement", () => {
  let store: ReturnType<typeof configureStore>;
  const initialState = {};

  beforeEach(() => {
    store = configureStore({
      reducer: {
        products: productsReducer,
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
        <ProductManagement />
      </Provider>
    );

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders products after loading", async () => {
    store.dispatch(fetchProducts.fulfilled(mockProducts, ""));

    render(
      <Provider store={store}>
        <ProductManagement />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText("Product 1")).toBeInTheDocument();
      expect(screen.getByText("Product 2")).toBeInTheDocument();
      expect(screen.getByText("$99.99")).toBeInTheDocument();
      expect(screen.getByText("$149.99")).toBeInTheDocument();
    });
  });

  it("renders add product button", async () => {
    store.dispatch(fetchProducts.fulfilled(mockProducts, ""));

    render(
      <Provider store={store}>
        <ProductManagement />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText("Add product")).toBeInTheDocument();
    });
  });
});
