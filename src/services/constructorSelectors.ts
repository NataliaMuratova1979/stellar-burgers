import { createSelector } from 'reselect';
import { TConstructorIngredient } from '@utils-types'; // Импортируйте нужные типы
import { RootState } from './store';

// Базовый селектор для получения состояния конструктора
const selectConstructor = (state: RootState) => state.constructor;

// Мемоизированный селектор
export const makeSelectConstructor = createSelector(
  [selectConstructor],
  (constructor) => ({
    bun: constructor.bun,
    ingredients: constructor.ingredients || []
  })
);
