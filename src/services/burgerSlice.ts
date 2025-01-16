import {
  createSlice,
  PayloadAction,
  createSelector,
  createAsyncThunk
} from '@reduxjs/toolkit';
import { TConstructorIngredient, TOrder } from '@utils-types'; // Импортируем ваши типы
import { RootState } from './store';
import { orderBurgerApi } from '../utils/burger-api';

interface ConstructorItems {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
}

// Определяем интерфейс - информация о конструкторе, статусе запроса на заказ и данные о заказе
interface BurgerState {
  constructorItems: ConstructorItems;
  orderRequest: boolean;
  orderModalData: TOrder | null;
  orderError: string | null;
}

// Начальное состояние
export const initialState: BurgerState = {
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
    },
    addIngredient(state, action: PayloadAction<TConstructorIngredient>) {
      state.constructorItems.ingredients.push(action.payload); // Добавляем ингредиент
    },
    removeIngredient(state, action: PayloadAction<string>) {
      const ingredientId = action.payload;
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (ingredient: TConstructorIngredient) => ingredient.id !== ingredientId
        );
    },
    setOrderRequest(state, action: PayloadAction<boolean>) {
      state.orderRequest = action.payload;
    },
    setOrderModalData(state, action: PayloadAction<TOrder | null>) {
      state.orderModalData = action.payload;
    },
    clearConstructor(state) {
      state.constructorItems.bun = null;
      state.constructorItems.ingredients = [];
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
        );
        state.constructorItems.ingredients.splice(
          index - 1,
          0,
          movedIngredient
        );
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
        );
        state.constructorItems.ingredients.splice(
          index + 1,
          0,
          movedIngredient
        );
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
