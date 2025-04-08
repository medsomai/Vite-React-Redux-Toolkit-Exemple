import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import type { Product } from '../../types';
import type { ProductFormData } from '../../schemas/product';

interface ProductsState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  products: [],
  loading: false,
  error: null,
};

export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
  // Simulate API call
  const response = await new Promise<Product[]>((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: '1',
          name: 'Product 1',
          description: 'Description for product 1',
          price: 99.99,
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Product 2',
          description: 'Description for product 2',
          price: 149.99,
          createdAt: new Date().toISOString(),
        },
      ]);
    }, 1000);
  });
  return response;
});

export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (productData: ProductFormData) => {
    // Simulate API call
    const newProduct: Product = {
      id: Math.random().toString(36).substr(2, 9),
      ...productData,
      createdAt: new Date().toISOString(),
    };
    await new Promise(resolve => setTimeout(resolve, 1000));
    return newProduct;
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, productData }: { id: string; productData: ProductFormData }) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { id, ...productData };
  }
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    return id;
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch products';
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.products.push(action.payload);
        toast.success('Product created successfully');
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex(product => product.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = { ...state.products[index], ...action.payload };
        }
        toast.success('Product updated successfully');
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(product => product.id !== action.payload);
        toast.success('Product deleted successfully');
      });
  },
});

export default productsSlice.reducer;