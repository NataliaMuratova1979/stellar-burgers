import React, { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import styles from './burger-ingredient.module.css';
import { useDispatch } from 'react-redux';
import { addIngredient } from '../../services/constructorSlice';

import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';

/**Этот компонент отвечает за отображение отдельного ингредиента бургера с учетом его количества и информации о текущем маршруте. Он использует оптимизацию через memo, чтобы избежать лишних рендеров. В текущем виде функция для добавления ингредиента еще не реализована, но предполагается, что она будет добавлена в будущем. */

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const location = useLocation();
    const dispatch = useDispatch();
    // эта функция должна добавлять ингредиент в конструктор бургера

    //const handleAdd = () => {};

    const handleAdd = () => {
      // Предполагается, что ingredient имеет id, если нет, нужно будет его добавить
      const ingredientWithId = {
        ...ingredient,
        id: ingredient._id // Если id отсутствует, генерируем новый
      };

      dispatch(addIngredient(ingredientWithId));
    };

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={count}
        locationState={{ background: location }}
        handleAdd={handleAdd}
      />
    );
  }
);
