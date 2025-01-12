import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import userReducer, {
  initialState,
  setUser,
  setIsAuthChecked
} from '../src/services/userSlice';
import { registerUserApi } from '../src/utils/burger-api';
import { TUser } from '../src/utils/types';

import { describe, it, expect, beforeEach } from '@jest/globals';

import { createAction } from '@reduxjs/toolkit';

describe('Тестирование userReducer', () => {
  const mockUser: TUser = { email: 'test@mail.com', name: 'Test User' };

  it('должен обрабатывать начальное состояние', () => {
    expect(userReducer(undefined, { type: '' })).toEqual(initialState);
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
