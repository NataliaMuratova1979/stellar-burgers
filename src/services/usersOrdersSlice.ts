import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getOrdersApi } from '../utils/burger-api'; // Путь к API
import { TOrder } from '@utils-types'; // Импортируем тип заказа

// Определяем начальное состояние
interface userOrdersState {
  orders: TOrder[];
  isLoading: boolean; // Изменено на isLoading
  fetchError: string | null; // Изменено на fetchError
}

export const initialState: userOrdersState = {
  orders: [],
  isLoading: false, // Изменено на isLoading
  fetchError: null // Изменено на fetchError
};

// Создаем асинхронный thunk для получения заказов
export const fetchUsersOrders = createAsyncThunk(
  'orders/fetchUsersOrders',
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
      state.fetchError = action.payload; // Устанавливаем ошибку
      console.log('Error set:', action.payload); // Логируем установку ошибки
    },
    clearError(state) {
      state.fetchError = null; // Очищаем ошибку
      console.log('Error cleared'); // Логируем очистку ошибки
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsersOrders.pending, (state) => {
        state.isLoading = true; // Устанавливаем состояние загрузки
        state.fetchError = null; // Сбрасываем ошибку
        console.log('usersOrdersSlice, Loading orders...'); // Логируем начало загрузки
      })
      .addCase(fetchUsersOrders.fulfilled, (state, action) => {
        state.isLoading = false; // Устанавливаем состояние загрузки в false
        console.log('ЗАКАЗЫ УСПЕШНО ПОЛУЧЕНЫ');
        state.orders = action.payload; // Сохраняем полученные заказы в состоянии
        console.log(
          'usersOrdersSlice, Orders loaded successfully:',
          action.payload
        ); // Логируем успешную загрузку заказов
      })
      .addCase(fetchUsersOrders.rejected, (state, action) => {
        state.isLoading = false; // Устанавливаем состояние загрузки в false
        state.fetchError = action.error.message || 'Failed to load orders'; // Устанавливаем сообщение об ошибке
        console.log('Failed to load orders:', action.error.message); // Логируем ошибку при загрузке заказов
      });
  }
});

// Экспортируем действия и редьюсер
export const { setError, clearError } = userOrdersSlice.actions;
export default userOrdersSlice.reducer;

// Селектор для получения заказов
export const selectUsersOrders = (state: { usersOrders: userOrdersState }) => {
  const orders = state.usersOrders.orders || []; // Получаем заказы из состояния или пустой массив
  console.log('usersOrdersSlice, Selecting orders from state:', orders); // Логируем выбор заказов из состояния
  return orders; // Возвращаем заказы из состояния
};

// Селектор для получения состояния загрузки
export const selectUsersLoading = (state: { usersOrders: userOrdersState }) => {
  console.log(
    'usersOrdersSlice, Selecting loading state:',
    state.usersOrders.isLoading // Изменено на isLoading
  );
  return state.usersOrders.isLoading; // Возвращаем состояние загрузки
};

// Селектор для получения ошибки
export const selectUsersError = (state: { usersOrders: userOrdersState }) => {
  console.log(
    'usersOrdersSlice, Selecting error state:',
    state.usersOrders.fetchError // Изменено на fetchError
  );
  return state.usersOrders.fetchError; // Возвращаем сообщение об ошибке
};
