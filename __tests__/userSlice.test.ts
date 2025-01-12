import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import userReducer, {
  initialState,
  setUser,
  setIsAuthChecked,
  registerUser,
  loginUser,
  fetchUser,
  updateUser,
  logout
} from '../src/services/userSlice';
import { registerUserApi } from '../src/utils/burger-api';
import { TUser } from '../src/utils/types';

import { describe, it, expect, beforeEach } from '@jest/globals';

import { createAction } from '@reduxjs/toolkit';

describe('Тестирование userSlice', () => {
  const mockUser: TUser = { email: 'test@mail.com', name: 'Test User' };

  it('должен обрабатывать начальное состояние', () => {
    expect(userReducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('Проверка авторизации пользователя', () => {
    const initialState = {
      data: null,
      isAuthChecked: false
    };

    const action = setIsAuthChecked(true);
    const nextState = userReducer(initialState, action);

    expect(nextState.isAuthChecked).toBe(true); // Проверяем, что флаг isAuthChecked стал true
  });

  it('Выход пользователя из системы', async () => {
    const mockUser: TUser = {
      email: 'test@example.com',
      name: 'Тестовый Пользователь'
    };

    // Эмулируем состояние, где пользователь уже залогинен
    const stateWithUser = {
      ...initialState,
      data: mockUser
    };

    // Создаем действие logout.fulfilled
    const action = logout.fulfilled(undefined, '', undefined);

    // Вызываем редьюсер с текущим состоянием и действием logout.fulfilled
    const nextState = userReducer(stateWithUser, action);

    // Проверяем, что данные пользователя очищены и состояние возвращается к начальному
    expect(nextState.data).toBeNull(); // Данные пользователя должны быть очищены
    expect(nextState.isAuthChecked).toBe(false); // Проверка аутентификации должна быть false, если так настроено
  });

  it('должен правильно устанавливать пользователя при выполнении действия setUser', () => {
    const action = {
      type: setUser.type, // используем действие setUser
      payload: mockUser
    };

    const state = userReducer(initialState, action);
    expect(state.data).toEqual(mockUser);
  });

  it('должен обрабатывать действие setIsAuthChecked', () => {
    const action = {
      type: setIsAuthChecked.type, // используем действие setIsAuthChecked
      payload: true
    };

    const state = userReducer(initialState, action);
    expect(state.isAuthChecked).toBe(true);
  });
});
