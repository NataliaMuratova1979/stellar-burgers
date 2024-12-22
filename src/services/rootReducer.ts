// rootReducer.ts
import { combineReducers } from 'redux';
import ingredientsReducer from './ingredientsSlice'; // слайс ингредиентов
//import constructorReducer from './constructorSlice'; // слайс конструктора
import burgerReducer from './burgerSlice';
import ordersReducer from './ordersSlice';
import userReducer from './userSlice';
import usersOrdersReducer from './usersOrdersSlice';
import orderNumberReducer from './orderNumberSlice'; // Импортируем редюсер для заказов по номеру

//import tokenReducer from './tokenSlice';

const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burger: burgerReducer,
  orders: ordersReducer,
  user: userReducer,
  usersOrders: usersOrdersReducer,
  orderNumber: orderNumberReducer
});

export default rootReducer;
