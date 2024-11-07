import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getFeedsApi } from '../utils/burger-api'; // Путь к вашему API
import { TOrder, TOrdersData } from '@utils-types'; // Путь к вашим типам

// Определение начального состояния
interface OrdersState {
  orders: TOrder[];
  total: number;
  totalToday: number;
  loading: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  orders: [],
  total: 0,
  totalToday: 0,
  loading: false,
  error: null
};

// Асинхронный thunk для получения заказов
export const fetchOrders = createAsyncThunk('orders/fetchOrders', async () => {
  const response = await getFeedsApi();
  return response; // Предполагается, что API возвращает объект TOrdersData
});

// Создание слайса
const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrders(state) {
      state.orders = [];
      state.total = 0;
      state.totalToday = 0;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchOrders.fulfilled,
        (state, action: PayloadAction<TOrdersData>) => {
          state.loading = false;
          state.orders = action.payload.orders;
          state.total = action.payload.total;
          state.totalToday = action.payload.totalToday;
        }
      )
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch orders';
      });
  }
});

// Экспорт действий и редьюсера
export const { clearOrders } = ordersSlice.actions;
export default ordersSlice.reducer;
