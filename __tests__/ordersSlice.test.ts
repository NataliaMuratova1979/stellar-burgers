import { configureStore } from '@reduxjs/toolkit';
import ordersReducer, {
  fetchOrders,
  clearOrders
} from '../src/services/ordersSlice';
import { TOrdersData } from '../src/utils/types';

import { describe, it, expect, beforeEach } from '@jest/globals';

describe('Тестирование ordersSlice', () => {
  const store = configureStore({ reducer: { orders: ordersReducer } });

  beforeEach(() => {
    store.dispatch(clearOrders());
  });

  it('должен установить loading в true, когда fetchOrders находится в состоянии ожидания', async () => {
    const action = fetchOrders.pending.type;
    store.dispatch({ type: action });

    const state = store.getState().orders;
    expect(state.loading).toBe(true);
    expect(state.error).toBe(null);
  });

  it('должен обновить состояние с заказами и установить loading в false, когда fetchOrders выполнен успешно', async () => {
    const mockResponse = {
      success: true,
      orders: [
        {
          _id: '1',
          status: 'done',
          name: 'Order 1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          number: 1,
          ingredients: ['ingredient1', 'ingredient2']
        },
        {
          _id: '2',
          status: 'pending',
          name: 'Order 2',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          number: 2,
          ingredients: ['ingredient3', 'ingredient4']
        }
      ],
      total: 2,
      totalToday: 1
    };

    const action = fetchOrders.fulfilled(mockResponse, '1');
    store.dispatch(action);

    const state = store.getState().orders;
    expect(state.loading).toBe(false);
    expect(state.orders).toEqual(mockResponse.orders);
    expect(state.total).toBe(mockResponse.total);
    expect(state.totalToday).toBe(mockResponse.totalToday);
  });

  it('должен установить ошибку и loading в false, когда fetchOrders завершился неудачно', async () => {
    const mockError = new Error('Ошибка загрузки');
    const action = fetchOrders.rejected(mockError, '2');
    store.dispatch(action);

    const state = store.getState().orders;
    expect(state.loading).toBe(false);
    expect(state.error).toBe(mockError.message);
  });

  it('должен очистить заказы, когда вызывается clearOrders', () => {
    store.dispatch(clearOrders());

    const state = store.getState().orders;
    expect(state.orders).toEqual([]);
    expect(state.total).toBe(0);
    expect(state.totalToday).toBe(0);
  });
});
