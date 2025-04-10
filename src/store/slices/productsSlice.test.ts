import { configureStore } from "@reduxjs/toolkit";
import productsReducer, {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../store/slices/productsSlice";

jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe("productsSlice", () => {
  let store: any;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        products: productsReducer,
      },
    });
  });

  it("should handle initial state", () => {
    expect(store.getState().products).toEqual({
      products: [],
      loading: false,
      error: null,
    });
  });

  it("should handle fetchProducts", async () => {
    await store.dispatch(fetchProducts());
    const state = store.getState().products;

    expect(state.loading).toBe(false);
    expect(state.products.length).toBeGreaterThan(0);
    expect(state.error).toBeNull();
  });

  it("should handle createProduct", async () => {
    const newProduct = {
      name: "Test Product",
      description: "Test Description that is long enough",
      price: 99.99,
    };

    await store.dispatch(createProduct(newProduct));
    const state = store.getState().products;

    expect(state.products).toHaveLength(1);
    expect(state.products[0].name).toBe(newProduct.name);
  });

  it("should handle updateProduct", async () => {
    // First create a product
    const initialProduct = {
      name: "Initial Product",
      description: "Initial Description that is long enough",
      price: 99.99,
    };
    await store.dispatch(createProduct(initialProduct));
    const productId = store.getState().products.products[0].id;

    // Then update it
    const updatedProduct = {
      name: "Updated Product",
      description: "Updated Description that is long enough",
      price: 149.99,
    };
    await store.dispatch(
      updateProduct({ id: productId, productData: updatedProduct })
    );

    const state = store.getState().products;
    const product = state.products.find((p) => p.id === productId);

    expect(product.name).toBe(updatedProduct.name);
    expect(product.price).toBe(updatedProduct.price);
  });

  it("should handle deleteProduct", async () => {
    // First create a product
    const product = {
      name: "Test Product",
      description: "Test Description that is long enough",
      price: 99.99,
    };
    await store.dispatch(createProduct(product));
    const productId = store.getState().products.products[0].id;

    // Then delete it
    await store.dispatch(deleteProduct(productId));
    const state = store.getState().products;

    expect(state.products).toHaveLength(0);
  });
});
