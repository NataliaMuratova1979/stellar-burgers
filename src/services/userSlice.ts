import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { TUser } from '@utils-types'; // Убедитесь, что здесь правильный путь к вашему типу TUser
import { RootState } from './store';
import { createSelector } from '@reduxjs/toolkit';
import { clearTokens, storeTokens } from '../utils/tokens';

import {
  TRegisterData,
  TLoginData,
  registerUserApi,
  loginUserApi,
  getUserApi,
  updateUserApi,
  logoutApi
} from '../utils/burger-api'; // Путь к API

interface User {
  name: string;
  email: string;
}

// Интерфейс состояния пользователя
interface UserState {
  data: User;
  isAuthenticated: boolean; // Флаг аутентификации
  loading: boolean; // Состояние загрузки
  error: string | null; // Ошибка, если есть
}

// Начальное состояние
const initialState: UserState = {
  data: {
    name: '',
    email: ''
  },
  isAuthenticated: false,
  loading: false,
  error: null
};

// Асинхронное действие для регистрации пользователя
export const registerUser = createAsyncThunk<TUser, TRegisterData>(
  'user/register',
  async (data, { rejectWithValue }) => {
    const response = await registerUserApi(data);

    if (!response?.success) {
      return rejectWithValue(response);
    }

    const { user, refreshToken, accessToken } = response;

    storeTokens(refreshToken, accessToken);

    return user;
  }
);

// Асинхронное действие для входа пользователя
export const loginUser = createAsyncThunk<TUser, TLoginData>(
  'user/login',
  async (data, { rejectWithValue }) => {
    const response = await loginUserApi(data);

    if (!response?.success) {
      return rejectWithValue(response);
    }

    const { user, refreshToken, accessToken } = response;

    storeTokens(refreshToken, accessToken);

    return user;
  }
);

// Асинхронное действие для получения данных о пользователе
export const fetchUser = createAsyncThunk(
  'user/fetch',
  async (_, { rejectWithValue }) => {
    const response = await getUserApi();

    if (!response?.success) {
      return rejectWithValue(response);
    }

    return response.user;
  }
);

// Асинхронное действие для обновления данных пользователя
export const updateUser = createAsyncThunk<TUser, Partial<TRegisterData>>(
  'user/update',
  async (data, { rejectWithValue }) => {
    const response = await updateUserApi(data);

    if (!response?.success) {
      return rejectWithValue(response);
    }

    return response.user;
  }
);

export const logout = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue }) => {
    const response = await logoutApi();

    if (!response?.success) {
      return rejectWithValue(response);
    }

    clearTokens();
  }
);

// Создание слайса
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<User>) => {
        // Изменяем TUser на User
        state.loading = false;
        state.data = action.payload; // Используем data вместо user
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
        // Изменяем TUser на User
        state.loading = false;
        state.data = action.payload; // Используем data вместо user
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export default userSlice.reducer; // Экспортируем редюсер по умолчанию
