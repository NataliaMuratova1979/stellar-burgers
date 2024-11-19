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
export const fetchUsersOrders = createAsyncThunk(
  'orders/fetchOrders',
  async () => {
    console.log('Fetching orders from the server...'); // Логируем начало загрузки
    const orders = await getOrdersApi(); // Получаем заказы через API
    console.log('Orders fetched:', orders); // Логируем полученные заказы
    return orders; // Возвращаем заказы
  }
);

// Создаем слайс
const userOrdersSlice = createSlice({
  name: 'usersOrders', // Изменено имя слайса на 'usersOrders'
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
      .addCase(fetchUsersOrders.pending, (state) => {
        state.loading = true; // Устанавливаем состояние загрузки
        state.error = null; // Сбрасываем ошибку
        console.log('usersOrdersSlice, Loading orders...'); // Логируем начало загрузки
      })
      .addCase(fetchUsersOrders.fulfilled, (state, action) => {
        state.loading = false; // Устанавливаем состояние загрузки в false
        console.log('ЗАКАЗЫ УСПЕШНО ПОЛУЧЕНЫ');
        state.orders = action.payload; // Сохраняем полученные заказы в состоянии
        console.log(
          'usersOrdersSlice, Orders loaded successfully:',
          action.payload
        ); // Логируем успешную загрузку заказов
      })
      .addCase(fetchUsersOrders.rejected, (state, action) => {
        state.loading = false; // Устанавливаем состояние загрузки в false
        state.error = action.error.message || 'Failed to load orders'; // Устанавливаем сообщение об ошибке
        console.log('Failed to load orders:', action.error.message); // Логируем ошибку при загрузке заказов
      });
  }
});

// Экспортируем действия и редьюсер
export const { setError, clearError } = userOrdersSlice.actions;
export default userOrdersSlice.reducer;

// Селектор для получения заказов
export const selectUsersOrders = (state: { usersOrders: OrdersState }) => {
  const orders = state.usersOrders.orders || []; // Получаем заказы из состояния или пустой массив
  console.log('usersOrdersSlice, Selecting orders from state:', orders); // Логируем выбор заказов из состояния
  return orders; // Возвращаем заказы из состояния
};

// Селектор для получения состояния загрузки
export const selectUsersLoading = (state: { usersOrders: OrdersState }) => {
  console.log(
    'usersOrdersSlice, Selecting loading state:',
    state.usersOrders.loading
  ); // Логируем состояние загрузки
  return state.usersOrders.loading; // Возвращаем состояние загрузки
};

// Селектор для получения ошибки
export const selectUsersError = (state: { usersOrders: OrdersState }) => {
  console.log(
    'usersOrdersSlice, Selecting error state:',
    state.usersOrders.error
  ); // Логируем состояние ошибки
  return state.usersOrders.error; // Возвращаем сообщение об ошибке
};
