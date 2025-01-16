import {
  createSlice,
  createAsyncThunk,
  createSelector
} from '@reduxjs/toolkit';
import { getOrderByNumberApi } from '../utils/burger-api'; // Импортируйте вашу функцию API
import { TOrder } from '@utils-types';
import { RootState } from './store';

interface OrderNumberState {
  orderNumberData: TOrder | null;
  loading: boolean;
  error: string | null;
}

export const initialState: OrderNumberState = {
  orderNumberData: null,
  loading: false,
  error: null
};

// Асинхронное действие для получения заказа по номеру
export const fetchOrderByNumber = createAsyncThunk(
  'order/fetchOrderByNumber',
  async (number: number) => {
    const response = await getOrderByNumberApi(number);

    // Предполагаем, что API возвращает массив заказов,
    // и мы ищем конкретный заказ по номеру
    const order = response.orders.find(
      (order: TOrder) => order.number === number
    );

    if (!order) {
      throw new Error('Order not found');
    }

    return order; // Возвращаем найденный заказ
  }
);

const orderNumberSlice = createSlice({
  name: 'orderNumber',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.loading = false;
        state.orderNumberData = action.payload; // Обновлено на orderNumberData
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch order';
      });
  }
});

// Экспорт редюсера и действия
export default orderNumberSlice.reducer;

// Селектор для получения заказа по номеру
export const selectOrderNumberData = (state: RootState, orderNumber: number) =>
  state.orderNumber.orderNumberData &&
  state.orderNumber.orderNumberData.number === orderNumber
    ? state.orderNumber.orderNumberData
    : null;
