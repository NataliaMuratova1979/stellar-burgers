// rootReducer.ts
import { combineReducers } from 'redux';
import ingredientsReducer from './ingredientsSlice'; // слайс ингредиентов

const rootReducer = combineReducers({
  ingredients: ingredientsReducer
  // Здесь можно добавить другие редьюсеры
});

export default rootReducer;
