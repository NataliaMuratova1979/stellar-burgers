import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TOrder } from '@utils-types'; // Импортируем ваши типы

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
}

// Начальное состояние
const initialState: BurgerState = {
  constructorItems: {
    bun: null,
    ingredients: []
  },
  orderRequest: false,
  orderModalData: null
};

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
