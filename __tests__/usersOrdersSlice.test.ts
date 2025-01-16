import userOrdersReducer, {
  fetchUsersOrders,
  setError,
  clearError,
  selectUsersOrders,
  selectUsersLoading,
  selectUsersError,
  initialState
} from '../src/services/usersOrdersSlice';
import { TOrder } from '../src/utils/types'; // Импортируйте TOrder

import { describe, it, expect } from '@jest/globals';

describe('Тестируем userOrdersSlice', () => {
  it('должен иметь начальное состояние', () => {
    expect(userOrdersReducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('должен устанавливать состояние загрузки при получении заказов (pending)', () => {
    const action = { type: fetchUsersOrders.pending.type };
    const state = userOrdersReducer(initialState, action);
    expect(state.isLoading).toBe(true);
    expect(state.fetchError).toBe(null);
  });

  it('должен устанавливать заказы при успешном получении (fulfilled)', () => {
    const mockOrders: TOrder[] = [
      {
        _id: '1',
        name: 'Order 1',
        status: 'done',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        number: 1,
        ingredients: ['ingredient1']
      },
      {
        _id: '2',
        name: 'Order 2',
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        number: 2,
        ingredients: ['ingredient2']
      }
    ];

    const action = {
      type: fetchUsersOrders.fulfilled.type,
      payload: mockOrders
    };

    const state = userOrdersReducer(initialState, action);
    expect(state.isLoading).toBe(false);
    expect(state.orders).toEqual(mockOrders);
    expect(state.fetchError).toBe(null);
  });

  it('должен обрабатывать ошибку при получении заказов (rejected)', () => {
    const errorMessage = 'Unable to fetch orders';
    const action = {
      type: fetchUsersOrders.rejected.type,
      error: { message: errorMessage }
    };
    const state = userOrdersReducer(initialState, action);
    expect(state.isLoading).toBe(false);
    expect(state.fetchError).toEqual(errorMessage);
  });

  it('должен устанавливать ошибку при вызове setError', () => {
    const error = 'Some error occurred';
    const action = setError(error);
    const state = userOrdersReducer(initialState, action);
    expect(state.fetchError).toEqual(error);
  });

  it('должен очищать ошибку при вызове clearError', () => {
    const action = clearError();
    const stateWithError = {
      ...initialState,
      fetchError: 'Some error occurred'
    };
    const newState = userOrdersReducer(stateWithError, action);
    expect(newState.fetchError).toBe(null);
  });

  // Тесты для селекторов
  it('должен правильно выбирать заказы из состояния', () => {
    const state = {
      usersOrders: { orders: [], isLoading: false, fetchError: null }
    };
    expect(selectUsersOrders(state)).toEqual([]);
  });

  it('должен правильно выбирать состояние загрузки', () => {
    const state = {
      usersOrders: { ...initialState, isLoading: true }
    };
    expect(selectUsersLoading(state)).toBe(true);
  });

  it('должен правильно выбирать сообщение об ошибке', () => {
    const errorMessage = 'Some Error';
    const state = {
      usersOrders: { ...initialState, fetchError: errorMessage }
    };
    expect(selectUsersError(state)).toBe(errorMessage);
  });
});
