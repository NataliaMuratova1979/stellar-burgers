// tests/orderNumberSlice.test.ts
import reducer, { fetchOrderByNumber } from '../src/services/orderNumberSlice';
import { TOrder } from '../src/utils/types';
import { getOrderByNumberApi } from '../src/utils/burger-api';

import { describe, it, expect, beforeEach } from '@jest/globals';

// Мок функции API для тестов
jest.mock('../src/utils/burger-api', () => ({
  getOrderByNumberApi: jest.fn()
}));

describe('Тестирование orderNumberSlice', () => {
  const initialState = {
    orderNumberData: null,
    loading: false,
    error: null
  };

  beforeEach(() => {
    // Сброс состояния перед каждым тестом
    jest.clearAllMocks();
  });

  it('должен обрабатывать fetchOrderByNumber.pending', () => {
    const action = { type: fetchOrderByNumber.pending.type };
    const state = reducer(initialState, action);

    expect(state.loading).toBe(true);
    expect(state.error).toBe(null);
  });

  it('должен обрабатывать fetchOrderByNumber.fulfilled', async () => {
    const mockOrder: TOrder = {
      _id: '1',
      number: 123,
      ingredients: ['ingredient1', 'ingredient2'],
      status: 'done', // Добавлено
      name: 'Заказ 123', // Добавлено
      createdAt: '2023-01-01T00:00:00Z', // Добавлено
      updatedAt: '2023-01-01T00:00:00Z' // Добавлено
    };

    // Настраиваем поведение для getOrderByNumberApi
    (getOrderByNumberApi as jest.Mock).mockResolvedValue({
      orders: [mockOrder]
    });

    // Создаем dispatch и getState
    const dispatch = jest.fn();
    const getState = jest.fn();

    // Вызов асинхронного действия с правильными аргументами
    const action = await fetchOrderByNumber(123)(dispatch, getState, undefined);

    // Проверка состояния редюсера
    const state = reducer(initialState, action);

    expect(state.loading).toBe(false);
    expect(state.orderNumberData).toEqual(mockOrder);
  });

  it('должен обрабатывать fetchOrderByNumber.rejected', () => {
    const errorMessage = 'Не удалось получить заказ';
    const action = {
      type: fetchOrderByNumber.rejected.type,
      error: { message: errorMessage }
    };
    const state = reducer(initialState, action);

    expect(state.loading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });
});
