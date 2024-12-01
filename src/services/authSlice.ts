// Код не используется, перенесен в userSlice

import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';

// Интерфейс состояния пользователя
type TUserState = {
  user: TUser | null; // Данные пользователя, могут быть либо объектом TUser, либо null
  isAuthChecked: boolean; // Флаг, который указывает, завершена ли проверка аутентификации
};

// Начальное состояние
export const initialState: TUserState = {
  user: null, // Изначально данные пользователя отсутствуют
  isAuthChecked: false // Проверка аутентификации еще не завершена
};

// Создание среза состояния для аутентификации
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Редьюсер для установки флага проверки аутентификации
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
      state.user = action.payload; // Устанавливаем данные пользователя в состояние
    }
  },
  selectors: {
    getIsAuthChecked: (state: TUserState): boolean => state.isAuthChecked,
    getUser: (state: TUserState): TUser | null => state.user,
  }
});

// Экспорт действий для использования в компонентах и других частях приложения
export const { setIsAuthChecked, setUser } = authSlice.actions;
export const { getIsAuthChecked, getUser } = authSlice.selectors;
