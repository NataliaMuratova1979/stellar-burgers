// rootReducer.ts
import { combineReducers } from 'redux';
import ingredientsReducer from './ingredientsSlice'; // слайс ингредиентов
import constructorReducer from './constructorSlice'; // слайс конструктора

const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  constructor: constructorReducer
  // Здесь можно добавить другие редьюсеры
});

export default rootReducer;
