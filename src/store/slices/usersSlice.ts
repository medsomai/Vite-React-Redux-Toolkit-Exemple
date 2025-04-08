import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import type { User } from '../../types';
import type { UserFormData } from '../../schemas/user';

interface UsersState {
  users: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  users: [],
  loading: false,
  error: null,
};

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  // Simulate API call
  const response = await new Promise<User[]>((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: '1',
          username: 'admin',
          email: 'admin@example.com',
          role: 'admin',
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          username: 'user1',
          email: 'user1@example.com',
          role: 'user',
          createdAt: new Date().toISOString(),
        },
      ]);
    }, 1000);
  });
  return response;
});

export const createUser = createAsyncThunk(
  'users/createUser',
  async (userData: UserFormData) => {
    // Simulate API call
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      ...userData,
      createdAt: new Date().toISOString(),
    };
    await new Promise(resolve => setTimeout(resolve, 1000));
    return newUser;
  }
);

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ id, userData }: { id: string; userData: UserFormData }) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { id, ...userData };
  }
);

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (id: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    return id;
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch users';
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.users.push(action.payload);
        toast.success('User created successfully');
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = { ...state.users[index], ...action.payload };
        }
        toast.success('User updated successfully');
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(user => user.id !== action.payload);
        toast.success('User deleted successfully');
      });
  },
});

export default usersSlice.reducer;