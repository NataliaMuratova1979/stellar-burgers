/**import { createSelector } from 'reselect';
import { TConstructorIngredient } from '@utils-types'; // Импортируйте нужные типы
import { RootState } from './store';

// Определите тип состояния конструктора
interface ConstructorState {
  bun: TConstructorIngredient | null; // или другой подходящий тип
  ingredients: TConstructorIngredient[]; // или другой подходящий тип
}

// Базовый селектор для получения состояния конструктора
const selectConstructorItems = (state: RootState): ConstructorState =>
  state.burger.constructorItems;

// Мемоизированный селектор
export const makeSelectConstructor = createSelector(
  [selectConstructorItems],
  (constructorItems: ConstructorState) => ({
    bun: constructorItems.bun,
    ingredients: constructorItems.ingredients || []
  })
);
*/
