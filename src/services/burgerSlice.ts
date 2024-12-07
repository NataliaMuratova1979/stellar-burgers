import {
  createSlice,
  PayloadAction,
  createSelector,
  createAsyncThunk
} from '@reduxjs/toolkit';
import { TConstructorIngredient, TOrder } from '@utils-types'; // Импортируем ваши типы
import { RootState } from './store'; // Импортируйте тип корневого состояния вашего Redux Store
import { orderBurgerApi } from '../utils/burger-api'; // Путь к файлу API

// Определяем интерфейсы для состояния - в конструкторе должна быть булка и ингредиенты
interface ConstructorItems {
  bun: TConstructorIngredient | null; // Используем TConstructorIngredient для булки
  ingredients: TConstructorIngredient[]; // Массив ингредиентов
}

// Определяем интерфейс - информация о конструкторе, статусе запроса на заказ и данные о заказе
interface BurgerState {
  constructorItems: ConstructorItems;
  orderRequest: boolean; // Запрос на оформление заказа
  orderModalData: TOrder | null; // Данные о заказе
  orderError: string | null; // Для хранения ошибки
}

// Начальное состояние
const initialState: BurgerState = {
  constructorItems: {
    bun: null,
    ingredients: []
  },
  orderRequest: false,
  orderModalData: null,
  orderError: null // Изначально ошибки нет
};

// Создаем thunk для отправки заказа
export const placeOrder = createAsyncThunk(
  'burger/placeOrder',
  async (ingredients: string[], { rejectWithValue }) => {
    try {
      const response = await orderBurgerApi(ingredients);
      return response.order; // Возвращаем данные о заказе
    } catch (error) {
      return rejectWithValue(error); // Обрабатываем ошибку
    }
  }
);

// Создаем слайс
const burgerSlice = createSlice({
  name: 'burger',
  initialState,
  reducers: {
    setBun(state, action: PayloadAction<TConstructorIngredient>) {
      state.constructorItems.bun = action.payload; // Устанавливаем булку
      console.log('Булка установлена:', action.payload);
    },
    addIngredient(state, action: PayloadAction<TConstructorIngredient>) {
      state.constructorItems.ingredients.push(action.payload); // Добавляем ингредиент
      console.log('Ингредиент добавлен:', action.payload);
      console.log('Текущие ингредиенты:', state.constructorItems.ingredients);
    },
    removeIngredient(state, action: PayloadAction<string>) {
      const ingredientId = action.payload;
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (ingredient: TConstructorIngredient) => ingredient.id !== ingredientId // Удаляем ингредиент по id
        );
      console.log('Ингредиент удален:', ingredientId);
      console.log(
        'Оставшиеся ингредиенты:',
        state.constructorItems.ingredients
      );
    },
    setOrderRequest(state, action: PayloadAction<boolean>) {
      state.orderRequest = action.payload; // Устанавливаем статус запроса на оформление заказа
      console.log('Статус запроса на оформление заказа:', action.payload);
    },
    setOrderModalData(state, action: PayloadAction<TOrder | null>) {
      state.orderModalData = action.payload; // Устанавливаем данные о заказе
      console.log('Данные о заказе установлены:', action.payload);
    },
    clearConstructor(state) {
      state.constructorItems.bun = null; // Очищаем булку
      state.constructorItems.ingredients = []; // Очищаем ингредиенты
      console.log('Конструктор очищен');
    },
    moveIngredientUp(state, action: PayloadAction<string>) {
      const ingredientId = action.payload;
      const index = state.constructorItems.ingredients.findIndex(
        (ingredient) => ingredient.id === ingredientId
      );
      if (index > 0) {
        const [movedIngredient] = state.constructorItems.ingredients.splice(
          index,
          1
        ); // Удаляем ингредиент из его текущей позиции
        state.constructorItems.ingredients.splice(
          index - 1,
          0,
          movedIngredient
        ); // Вставляем его на одну позицию вверх
        console.log('Ингредиент перемещен вверх:', movedIngredient);
      }
    },
    moveIngredientDown(state, action: PayloadAction<string>) {
      const ingredientId = action.payload;
      const index = state.constructorItems.ingredients.findIndex(
        (ingredient) => ingredient.id === ingredientId
      );
      if (index < state.constructorItems.ingredients.length - 1) {
        const [movedIngredient] = state.constructorItems.ingredients.splice(
          index,
          1
        ); // Удаляем ингредиент из его текущей позиции
        state.constructorItems.ingredients.splice(
          index + 1,
          0,
          movedIngredient
        ); // Вставляем его на одну позицию вниз
        console.log('Ингредиент перемещен вниз:', movedIngredient);
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => {
        state.orderRequest = true; // Устанавливаем статус запроса в true
        state.orderError = null; // Сбрасываем ошибку
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.orderRequest = false; // Запрос завершен
        state.orderModalData = action.payload; // Устанавливаем данные о заказе
        console.log('Заказ успешно оформлен:', action.payload);
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.orderRequest = false; // Запрос завершен
        state.orderError = action.payload as string; // Устанавливаем ошибку
        console.error('Ошибка при оформлении заказа:', action.payload);
      });
  }
});

// Экспортируем действия
export const {
  setBun,
  addIngredient,
  removeIngredient,
  setOrderRequest,
  setOrderModalData,
  clearConstructor,
  moveIngredientUp,
  moveIngredientDown
} = burgerSlice.actions;

// Экспортируем редюсер
export default burgerSlice.reducer;

// Селектор для получения булки
export const selectBun = (state: RootState) =>
  state.burger.constructorItems.bun;

// Селектор для получения списка ингредиентов
export const selectIngredients = (state: RootState) =>
  state.burger.constructorItems.ingredients;

// Селектор для получения статуса запроса на заказ
export const selectOrderRequest = (state: RootState) =>
  state.burger.orderRequest;

// Селектор для получения данных о заказе
export const selectOrderModalData = (state: RootState) =>
  state.burger.orderModalData;

// Селектор для получения общего количества ингредиентов
export const selectTotalIngredientsCount = createSelector(
  [selectIngredients],
  (ingredients) => ingredients.length
);

// Селектор для получения состояния заказа
export const selectOrderError = (state: RootState) => state.burger.orderError;

// Селектор для получения объекта заказа
export const selectBurgerConstructor = (state: RootState) => {
  const { bun, ingredients } = state.burger.constructorItems;
  return {
    bun: bun ? bun._id : null, // Если булка выбрана, возвращаем ее ID как строку, иначе null
    ingredients: ingredients.map((ingredient) => ingredient._id) // Возвращаем массив ID ингредиентов
  };
};
