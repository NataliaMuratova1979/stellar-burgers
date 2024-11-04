import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient } from '@utils-types';

export interface ConstructorState {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[]; // Массив ингредиентов
  orderRequest: boolean;
  orderModalData: any; //
}

const initialState: ConstructorState = {
  bun: null,
  ingredients: [],
  orderRequest: false,
  orderModalData: null // Или любое другое начальное значение
};

const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    addBun(state, action: PayloadAction<TConstructorIngredient>) {
      state.bun = action.payload;
    },
    addIngredient(state, action: PayloadAction<TConstructorIngredient>) {
      // Отладочные сообщения
      console.log('Current ingredients before adding:', state.ingredients);
      console.log('New ingredient to add:', action.payload);

      // Проверка на наличие массива ingredients
      if (!state.ingredients) {
        console.error('Ingredients array is undefined. Initializing it now.');
        state.ingredients = []; // Инициализируем массив, если он undefined
      }

      state.ingredients.push(action.payload);

      console.log('Current ingredients after adding:', state.ingredients);
    },
    removeIngredient(state, action: PayloadAction<string>) {
      if (state.ingredients) {
        state.ingredients = state.ingredients.filter(
          (ingredient) => ingredient.id !== action.payload
        );
      } else {
        console.error(
          'Cannot remove ingredient because ingredients array is undefined.'
        );
      }
    },
    clearConstructor(state) {
      state.bun = null;
      state.ingredients = [];
    },
    moveIngredient(
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) {
      if (state.ingredients) {
        const { fromIndex, toIndex } = action.payload;
        const ingredientToMove = state.ingredients[fromIndex];
        state.ingredients.splice(fromIndex, 1);
        state.ingredients.splice(toIndex, 0, ingredientToMove);
      } else {
        console.error(
          'Cannot move ingredient because ingredients array is undefined.'
        );
      }
    },
    setIngredients(state, action: PayloadAction<TConstructorIngredient[]>) {
      state.ingredients = action.payload;
    }
  }
});

export const {
  addBun,
  addIngredient,
  removeIngredient,
  clearConstructor,
  moveIngredient,
  setIngredients
} = constructorSlice.actions;

export default constructorSlice.reducer;
