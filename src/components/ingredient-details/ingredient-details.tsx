import { FC, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../services/store';
import { useParams } from 'react-router-dom';
import { fetchIngredients } from '../../services/ingredientsSlice'; // импортируем  thunk-функцию
import { TIngredient } from '@utils-types';

/** Этот компонент предназначен для отображения деталей ингредиента.
 Он используется для вывода данных в модальном окне
 */

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>(); // Получаем id из параметров маршрута

  const ingredients = useSelector(
    (state: RootState) => state.ingredients.ingredients
  );

  console.log(ingredients);

  const ingredientData = ingredients.find(
    (ingredient: TIngredient) => ingredient._id === id
  );

  console.log(ingredientData);

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
