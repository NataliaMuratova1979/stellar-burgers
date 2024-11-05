// rootReducer.ts
import { combineReducers } from 'redux';
import ingredientsReducer from './ingredientsSlice'; // слайс ингредиентов
//import constructorReducer from './constructorSlice'; // слайс конструктора
import burgerReducer from './burgerSlice';

const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  //constructor: constructorReducer,
  burger: burgerReducer
  // Здесь можно добавить другие редьюсеры
});

export default rootReducer;
