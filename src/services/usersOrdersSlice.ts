import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getOrdersApi } from '../utils/burger-api'; // Путь к API
import { TOrder } from '@utils-types'; // Импортируем тип заказа

// Определяем начальное состояние
interface OrdersState {
  orders: TOrder[];
  loading: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  orders: [],
  loading: false,
  error: null
};

// Создаем асинхронный thunk для получения заказов
export const fetchOrders = createAsyncThunk('orders/fetchOrders', async () => {
  console.log('Fetching orders from the server...'); // Логируем начало загрузки
  const orders = await getOrdersApi(); // Получаем заказы через API
  console.log('Orders fetched:', orders); // Логируем полученные заказы
  return orders; // Возвращаем заказы
});

// Создаем слайс
const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setError(state, action) {
      state.error = action.payload; // Устанавливаем ошибку
      console.log('Error set:', action.payload); // Логируем установку ошибки
    },
    clearError(state) {
      state.error = null; // Очищаем ошибку
      console.log('Error cleared'); // Логируем очистку ошибки
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true; // Устанавливаем состояние загрузки
        state.error = null; // Сбрасываем ошибку
        console.log('Loading orders...'); // Логируем начало загрузки
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false; // Устанавливаем состояние загрузки в false
        state.orders = action.payload; // Сохраняем полученные заказы в состоянии
        console.log('Orders loaded successfully:', action.payload); // Логируем успешную загрузку заказов
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false; // Устанавливаем состояние загрузки в false
        state.error = action.error.message || 'Failed to load orders'; // Устанавливаем сообщение об ошибке
        console.log('Failed to load orders:', action.error.message); // Логируем ошибку при загрузке заказов
      });
  }
});

// Экспортируем действия и редьюсер
export const { setError, clearError } = ordersSlice.actions;
export default ordersSlice.reducer;

// Селектор для получения заказов
export const selectOrders = (state: { orders: OrdersState }) => {
  console.log('Selecting orders from state:', state.orders.orders); // Логируем выбор заказов из состояния
  return state.orders.orders; // Возвращаем заказы из состояния
};

// Селектор для получения состояния загрузки
export const selectLoading = (state: { orders: OrdersState }) => {
  console.log('Selecting loading state:', state.orders.loading); // Логируем состояние загрузки
  return state.orders.loading; // Возвращаем состояние загрузки
};

// Селектор для получения ошибки
export const selectError = (state: { orders: OrdersState }) => {
  console.log('Selecting error state:', state.orders.error); // Логируем состояние ошибки
  return state.orders.error; // Возвращаем сообщение об ошибке
};
