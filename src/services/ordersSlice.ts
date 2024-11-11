import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  createSelector
} from '@reduxjs/toolkit';
import { getFeedsApi } from '../utils/burger-api'; // Путь к API
import { TOrder, TOrdersData } from '@utils-types'; // Путь к типам
import { RootState } from './store';

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

// Создание асинхронного действия для получения заказов
export const fetchOrders = createAsyncThunk('orders/fetchOrders', async () => {
  console.log('Получение заказов...'); // Лог перед запросом
  try {
    const response = await getFeedsApi();
    console.log('Заказы получены:', response); // Лог после получения ответа
    return response; // Возвращаем данные для fulfilled
  } catch (error) {
    console.error('Ошибка при получении заказов:', error);
    throw error; // Пробрасываем ошибку для обработки в extraReducers
  }
});

// Создание слайса
const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrders(state) {
      console.log('Очистка заказов...'); // Лог при очистке
      state.orders = [];
      state.total = 0;
      state.totalToday = 0;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        console.log('Получение заказов в процессе...'); // Лог при начале запроса
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchOrders.fulfilled,
        (state, action: PayloadAction<TOrdersData>) => {
          console.log('Получение заказов завершено:', action.payload); // Лог при успешном ответе
          state.loading = false;
          state.orders = action.payload.orders;
          state.total = action.payload.total;
          state.totalToday = action.payload.totalToday;
        }
      )
      .addCase(fetchOrders.rejected, (state, action) => {
        console.error(
          'Получение заказов завершилось ошибкой:',
          action.error.message
        ); // Лог при ошибке
        state.loading = false;
        state.error = action.error.message || 'Не удалось получить заказы';
      });
  }
});

// Селектор для получения всех заказов
export const selectOrders = (state: RootState) => state.orders.orders;

// Селектор для получения общего количества заказов
export const selectTotalOrders = (state: RootState) => state.orders.total;

// Селектор для получения количества заказов на сегодня
export const selectTotalToday = (state: RootState) => state.orders.totalToday;

// Селектор для получения состояния загрузки
export const selectLoading = (state: RootState) => state.orders.loading;

// Селектор для получения ошибки
export const selectError = (state: RootState) => state.orders.error;

// Селектор для получения всех данных о заказах
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

// Селектор для получения заказа по номеру
export const selectOrderByNumber = (state: RootState, orderNumber: string) =>
  state.orders.orders.find((order) => String(order.number) === orderNumber) ||
  null;

// Экспорт действий и редьюсера
export const { clearOrders } = ordersSlice.actions;
export default ordersSlice.reducer;
