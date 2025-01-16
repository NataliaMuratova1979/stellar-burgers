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

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    resetError: (state) => {
      // state.error = null; // Сбрасываем ошибку
    },
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
    setIsAuthChecked: (state, action: PayloadAction<boolean>) => {
      state.isAuthChecked = action.payload;
    },
    setUser: (state, action: PayloadAction<TUser | null>): void => {
      state.data = action.payload;
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {})
      .addCase(
        registerUser.fulfilled,
        (state, action: PayloadAction<TUser>) => {
          state.data = action.payload;
        }
      )
      .addCase(registerUser.rejected, (state, action) => {
        console.error('Ошибка при регистрации пользователя:', action.payload);
      })
      .addCase(loginUser.pending, (state) => {})
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<TUser>) => {
        state.data = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        console.error('Ошибка при входе пользователя:', action.payload);
      })
      .addCase(logout.pending, (state) => {
        console.log('Выход пользователя начат...');
      })
      .addCase(logout.fulfilled, (state) => {
        console.log('Выход пользователя успешен');
        state.data = null;
      })
      .addCase(logout.rejected, (state, action) => {
        console.error('Ошибка при выходе пользователя:', action.payload);
      });
  },
  selectors: {
    getIsAuthChecked: (state: TUserState): boolean => state.isAuthChecked,
    getUser: (state: TUserState): TUser | null => state.data
  }
});

export const { setIsAuthChecked, setUser } = userSlice.actions;
export const { getIsAuthChecked, getUser } = userSlice.selectors;

export const selectUser = (state: RootState) => state.user;

export const selectUserData = createSelector(selectUser, (user) => user.data);

export default userSlice.reducer;

export const selectUserName = (state: RootState) =>
  state.user.data ? state.user.data.name : null;

export const checkUserAuth = createAsyncThunk(
  'auth/checkUserAuth',
  async (_, { dispatch }) => {
    const token = getAccessToken();

    if (token) {
      console.log(
        'checkUserAuth Токен найден. Выполняется запрос к API для получения данных пользователя...'
      );
      try {
        const response = await getUserApi();

        dispatch(setUser(response.user));
      } catch (error) {
        console.error(
          'checkUserAuth Не удалось получить данные пользователя:',
          error
        );
      }
    } else {
      console.log(
        'checkUserAuth Токен не найден. Пользователь не аутентифицирован.'
      );
    }

    dispatch(setIsAuthChecked(true));
  }
);
