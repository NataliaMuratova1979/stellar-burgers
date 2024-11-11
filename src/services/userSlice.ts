import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { RootState } from './store';

// Определяем тип начального состояния для пользователя
type TInitialState = {
  user: TUser;
  isAuthenticated: boolean;
  isInit: boolean;
};

// Начальное состояние
export const initialState: TInitialState = {
  user: { name: '', email: '' }, // Информация о пользователе
  isAuthenticated: false, // Флаг аутентификации пользователя
  isInit: false // Флаг инициализации состояния пользователя
};

// Создаем слайс для работы с пользователем
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Инициализация состояния пользователя
    init(state) {
      console.log('Инициализируем состояние пользователя');
      state.isInit = true; // Устанавливаем флаг инициализации
    },
    // Установка информации о пользователе
    setUser(state, action: PayloadAction<TUser>) {
      console.log('Устанавливаем информацию о пользователе:', action.payload);
      state.user = action.payload; // Устанавливаем информацию о пользователе
      state.isAuthenticated = true; // Устанавливаем флаг аутентификации в true
    },
    // Выход пользователя из системы
    logout(state) {
      console.log('Пользователь вышел из системы');
      state.user = { name: '', email: '' }; // Очищаем информацию о пользователе
      state.isAuthenticated = false; // Сбрасываем флаг аутентификации
    }
  }
});

// Экспортируем редюсеры и селекторы
export const { init, setUser, logout } = userSlice.actions;
export const selectUser = (state: RootState) => state.user.user;
export const selectIsAuthenticated = (state: RootState) =>
  state.user.isAuthenticated;

export default userSlice.reducer;
