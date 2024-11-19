// rootReducer.ts
import { combineReducers } from 'redux';
import ingredientsReducer from './ingredientsSlice'; // слайс ингредиентов
//import constructorReducer from './constructorSlice'; // слайс конструктора
import burgerReducer from './burgerSlice';
import ordersReducer from './ordersSlice';
import userReducer from './userSlice';
import usersOrdersReducer from './usersOrdersSlice';

//import tokenReducer from './tokenSlice';

const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  //constructor: constructorReducer,
  burger: burgerReducer,
  orders: ordersReducer,
  user: userReducer,
  usersOrders: usersOrdersReducer
  //token: authSlice
});

export default rootReducer;
