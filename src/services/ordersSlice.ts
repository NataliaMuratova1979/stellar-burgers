import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  createSelector
} from '@reduxjs/toolkit';
import { getFeedsApi } from '../utils/burger-api';
import { TOrder, TOrdersData } from '@utils-types';
import { RootState } from './store';

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

export const fetchOrders = createAsyncThunk('orders/fetchOrders', async () => {
  try {
    const response = await getFeedsApi();
    return response;
  } catch (error) {
    throw error;
  }
});

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
        state.error = action.error.message || 'Не удалось получить заказы';
      });
  }
});

export const selectOrders = (state: RootState) => state.orders.orders;
export const selectTotalOrders = (state: RootState) => state.orders.total;
export const selectTotalToday = (state: RootState) => state.orders.totalToday;
export const selectLoading = (state: RootState) => state.orders.loading;
export const selectError = (state: RootState) => state.orders.error;

export const selectOrdersData = createSelector(
  [
    selectOrders,
    selectTotalOrders,
    selectTotalToday,
    selectLoading,
    selectError
  ],
  (orders, total, totalToday, loading, error) => ({
    orders,
    total,
    totalToday,
    loading,
    error
  })
);

export const selectOrderByNumber = (state: RootState, orderNumber: string) =>
  state.orders.orders.find((order) => String(order.number) === orderNumber) ||
  null;

export const { clearOrders } = ordersSlice.actions;
export default ordersSlice.reducer;
