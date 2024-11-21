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
  isAuthChecked: boolean; // Флаг проверки аутентификации
}

// Начальное состояние
const initialState: UserState = {
  data: {
    name: '',
    email: ''
  },
  isAuthenticated: false,
  loading: false,
  error: null,
  isAuthChecked: false
};

// Асинхронное действие для регистрации пользователя
export const registerUser = createAsyncThunk<TUser, TRegisterData>(
  'user/register',
  async (data, { rejectWithValue }) => {
    // Вызов API для регистрации пользователя с переданными данными
    const response = await registerUserApi(data);

    // Проверка успешности ответа от API
    if (!response?.success) {
      // Если ответ не успешен, возвращаем ошибку с помощью rejectWithValue
      return rejectWithValue(response);
    }

    // Извлечение данных пользователя и токенов из ответа
    const { user, refreshToken, accessToken } = response;

    // Сохранение токенов в локальное хранилище или куки
    storeTokens(refreshToken, accessToken);

    // Возвращаем объект пользователя для дальнейшего использования в редюсере
    return user;
  }
);

// Асинхронное действие для входа пользователя
export const loginUser = createAsyncThunk<TUser, TLoginData>(
  'user/login',
  async (data, { rejectWithValue }) => {
    // Вызов API для входа пользователя с переданными данными
    const response = await loginUserApi(data);

    // Проверка успешности ответа от API
    if (!response?.success) {
      // Если ответ не успешен, возвращаем ошибку с помощью rejectWithValue
      return rejectWithValue(response);
    }

    // Извлечение данных пользователя и токенов из ответа
    const { user, refreshToken, accessToken } = response;

    // Сохранение токенов в локальное хранилище или куки
    storeTokens(refreshToken, accessToken);

    // Возвращаем объект пользователя для дальнейшего использования в редюсере
    return user;
  }
);

// Асинхронное действие для получения данных о текущем пользователе
export const fetchUser = createAsyncThunk(
  'user/fetch',
  async (_, { rejectWithValue }) => {
    // Вызов API для получения данных о текущем пользователе
    const response = await getUserApi();

    // Проверка успешности ответа от API
    if (!response?.success) {
      // Если ответ не успешен, возвращаем ошибку с помощью rejectWithValue
      return rejectWithValue(response);
    }

    // Возвращаем объект пользователя для дальнейшего использования в редюсере
    return response.user;
  }
);

// Асинхронное действие для обновления данных пользователя
export const updateUser = createAsyncThunk<TUser, Partial<TRegisterData>>(
  'user/update',
  async (data, { rejectWithValue }) => {
    // Вызов API для обновления данных пользователя с переданными частичными данными
    const response = await updateUserApi(data);

    // Проверка успешности ответа от API
    if (!response?.success) {
      // Если ответ не успешен, возвращаем ошибку с помощью rejectWithValue
      return rejectWithValue(response);
    }

    // Возвращаем обновленный объект пользователя для дальнейшего использования в редюсере
    return response.user;
  }
);

// Асинхронное действие для выхода пользователя
export const logout = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue }) => {
    // Вызов API для выхода пользователя
    const response = await logoutApi();

    // Проверка успешности ответа от API
    if (!response?.success) {
      // Если ответ не успешен, возвращаем ошибку с помощью rejectWithValue
      return rejectWithValue(response);
    }

    // Очистка токенов из локального хранилища или куки после успешного выхода
    clearTokens();
  }
);

// Создание слайса пользователя с помощью Redux Toolkit
const userSlice = createSlice({
  name: 'user', // Имя слайса
  initialState, // Начальное состояние
  reducers: {
    // редюсер для сброса ошибки
    resetError: (state) => {
      state.error = null; // Сбрасываем ошибку
    },
    // редюсер для обновления данных пользователя
    updateUserData: (state, action: PayloadAction<Partial<User>>) => {
      state.data = { ...state.data, ...action.payload }; // Обновляем данные пользователя
    },
    // Редюсер для установки флага проверки аутентификации
    setIsAuthChecked: (state, action: PayloadAction<boolean>) => {
      state.isAuthChecked = action.payload; // Устанавливаем флаг проверки аутентификации
    }
  },

  extraReducers: (builder) => {
    builder
      // Обработка состояния при регистрации пользователя
      .addCase(registerUser.pending, (state) => {
        console.log('Регистрация пользователя начата...'); // Лог начала регистрации
        state.loading = true; // Устанавливаем состояние загрузки в true
        state.error = null; // Сбрасываем ошибку перед началом регистрации
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<User>) => {
        console.log('Регистрация пользователя успешна:', action.payload); // Лог успешной регистрации
        state.loading = false; // Сбрасываем состояние загрузки
        state.data = action.payload; // Сохраняем данные пользователя в состоянии
        state.isAuthenticated = true; // Устанавливаем флаг аутентификации в true
      })
      .addCase(registerUser.rejected, (state, action) => {
        console.error('Ошибка при регистрации пользователя:', action.payload); // Лог ошибки регистрации
        state.loading = false; // Сбрасываем состояние загрузки
        state.error = action.payload as string; // Сохраняем ошибку в состоянии
      })
      // Обработка состояния при входе пользователя
      .addCase(loginUser.pending, (state) => {
        console.log('Вход пользователя начат...'); // Лог начала входа
        state.loading = true; // Устанавливаем состояние загрузки в true
        state.error = null; // Сбрасываем ошибку перед началом входа
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
        console.log('Вход пользователя успешен:', action.payload); // Лог успешного входа
        state.loading = false; // Сбрасываем состояние загрузки
        state.data = action.payload; // Сохраняем данные пользователя в состоянии
        state.isAuthenticated = true; // Устанавливаем флаг аутентификации в true
      })
      .addCase(loginUser.rejected, (state, action) => {
        console.error('Ошибка при входе пользователя:', action.payload); // Лог ошибки входа
        state.loading = false; // Сбрасываем состояние загрузки
        state.error = action.payload as string; // Сохраняем ошибку в состоянии
      })
      // Обработка состояния при выходе пользователя
      .addCase(logout.pending, (state) => {
        console.log('Выход пользователя начат...'); // Лог начала выхода
        state.loading = true; // Устанавливаем состояние загрузки в true
      })
      .addCase(logout.fulfilled, (state) => {
        console.log('Выход пользователя успешен'); // Лог успешного выхода
        state.loading = false; // Сбрасываем состояние загрузки
        state.data = { name: '', email: '' }; // Сброс данных пользователя
        state.isAuthenticated = false; // Устанавливаем флаг аутентификации в false
      })
      .addCase(logout.rejected, (state, action) => {
        console.error('Ошибка при выходе пользователя:', action.payload); // Лог ошибки выхода
        state.loading = false; // Сбрасываем состояние загрузки
        state.error = action.payload as string; // Сохраняем ошибку в состоянии
      });
  }
});

// Селектор для получения состояния пользователя
export const selectUser = (state: RootState) => state.user;

// Селектор для получения данных пользователя
export const selectUserData = createSelector(selectUser, (user) => user.data);

// Селектор для получения состояния загрузки
export const selectIsLoading = createSelector(
  selectUser,
  (user) => user.loading
);

// Селектор для получения ошибки
export const selectError = createSelector(selectUser, (user) => user.error);

// Селектор для проверки аутентификации пользователя
export const selectIsAuthenticated = createSelector(
  selectUser,
  (user) => user.isAuthenticated
);

// Экспортируем редюсер по умолчанию для использования в хранилище Redux
export default userSlice.reducer;

// Селектор для получения имени пользователя
export const selectUserName = (state: RootState) => state.user.data.name;
