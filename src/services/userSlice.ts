import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { RootState } from './store';
import { createSelector } from '@reduxjs/toolkit';
import { clearTokens, storeTokens, getAccessToken } from '../utils/tokens';
import { getCookie } from '../utils/cookie';

import {
  TRegisterData,
  TLoginData,
  registerUserApi,
  loginUserApi,
  getUserApi,
  updateUserApi,
  logoutApi,
  fetchWithRefresh
} from '../utils/burger-api';

type TUserState = {
  data: TUser | null;
  isAuthChecked: boolean;
};

export const initialState: TUserState = {
  data: null,
  isAuthChecked: false
};

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

export const fetchRefresh = createAsyncThunk<TUser>(
  'user/fetchRefres',

  async (_, { rejectWithValue }) => {
    try {
      const accessToken = getCookie('accessToken');

      const headers: HeadersInit = {
        'Content-Type': 'application/json',

        ...(accessToken ? { 'x-access-token': accessToken } : {})
      };

      const response = await fetchWithRefresh<TUser>('/api/user', {
        method: 'GET', // Метод запроса
        headers // Заголовки запроса
      });

      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

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

export const updateUser = createAsyncThunk<TUser, Partial<TRegisterData>>(
  'user/update',
  async (data, { rejectWithValue }) => {
    const response = await updateUserApi(data);

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
      // state.error = null; // Сбрасываем ошибку
    },
    // редюсер для обновления данных пользователя
    updateUserData: (state, action: PayloadAction<Partial<TUser>>) => {
      if (state.data) {
        state.data = {
          ...state.data,
          ...action.payload,
          name: action.payload.name ?? state.data.name,
          email: action.payload.email ?? state.data.email
        };
      }
    },
    setIsAuthChecked: (
      state,
      action: PayloadAction<boolean> // Действие содержит булевое значение
    ) => {
      console.log('setIsAuthChecked action payload:', action.payload); // Логируем значение payload
      state.isAuthChecked = action.payload; // Устанавливаем новое значение флага
    },
    // Редьюсер для установки данных пользователя
    setUser: (
      state,
      action: PayloadAction<TUser | null> // Действие содержит данные пользователя или null
    ): void => {
      console.log('setUser action payload:', action.payload); // Логируем значение payload
      state.data = action.payload; // Устанавливаем данные пользователя в состояние
    }
  },

  extraReducers: (builder) => {
    builder
      // Обработка состояния при регистрации пользователя
      .addCase(registerUser.pending, (state) => {
        console.log('Регистрация пользователя начата...'); // Лог начала регистрации
      })
      .addCase(
        registerUser.fulfilled,
        (state, action: PayloadAction<TUser>) => {
          console.log('Регистрация пользователя успешна:', action.payload); // Лог успешной регистрации
          state.data = action.payload; // Сохраняем данные пользователя в состоянии
        }
      )
      .addCase(registerUser.rejected, (state, action) => {
        console.error('Ошибка при регистрации пользователя:', action.payload); // Лог ошибки регистрации
      })
      // Обработка состояния при входе пользователя
      .addCase(loginUser.pending, (state) => {
        console.log('Вход пользователя начат...'); // Лог начала входа
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<TUser>) => {
        console.log('Вход пользователя успешен:', action.payload); // Лог успешного входа
        state.data = action.payload; // Сохраняем данные пользователя в состоянии
        state.isAuthChecked = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        console.error('Ошибка при входе пользователя:', action.payload); // Лог ошибки входа
      })
      // Обработка состояния при выходе пользователя
      .addCase(logout.pending, (state) => {
        console.log('Выход пользователя начат...'); // Лог начала выхода
      })
      .addCase(logout.fulfilled, (state) => {
        console.log('Выход пользователя успешен'); // Лог успешного выхода
        state.data = null; // Сброс данных пользователя
      })
      .addCase(logout.rejected, (state, action) => {
        console.error('Ошибка при выходе пользователя:', action.payload); // Лог ошибки выхода
      });
  },
  selectors: {
    getIsAuthChecked: (state: TUserState): boolean => state.isAuthChecked,
    getUser: (state: TUserState): TUser | null => state.data
  }
});

// Экспорт действий для использования в компонентах и других частях приложения
export const { setIsAuthChecked, setUser } = userSlice.actions;
export const { getIsAuthChecked, getUser } = userSlice.selectors;

// Селектор для получения состояния пользователя
export const selectUser = (state: RootState) => state.user;

// Селектор для получения данных пользователя
export const selectUserData = createSelector(selectUser, (user) => user.data);

// Экспортируем редюсер по умолчанию для использования в хранилище Redux
export default userSlice.reducer;

// Селектор для получения имени пользователя
export const selectUserName = (state: RootState) =>
  state.user.data ? state.user.data.name : null;

// Селектор для проверки аутентификации, извлекая токен из cookie и выполняя запрос для получения данных пользователя
export const checkUserAuth = createAsyncThunk(
  'auth/checkUserAuth',
  async (_, { dispatch }) => {
    const token = getAccessToken(); // Получаем токен из cookie
    console.log('checkUserAuth Токен доступа:', token);

    if (token) {
      console.log(
        'checkUserAuth Токен найден. Выполняется запрос к API для получения данных пользователя...'
      );
      try {
        const response = await getUserApi(); // Выполняем запрос к API
        console.log('checkUserAuth Данные пользователя получены:', response);

        // Диспатчим действие для установки пользователя в состояние
        dispatch(setUser(response.user));
      } catch (error) {
        console.error(
          'checkUserAuth Не удалось получить данные пользователя:',
          error
        );
        // Можно также диспатчить действие для обработки ошибок
      }
    } else {
      console.log(
        'checkUserAuth Токен не найден. Пользователь не аутентифицирован.'
      );
    }

    dispatch(setIsAuthChecked(true)); // Устанавливаем флаг проверки аутентификации
    console.log('checkUserAuth Проверка аутентификации завершена.');
  }
);
