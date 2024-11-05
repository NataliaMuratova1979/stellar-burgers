import React, { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import styles from './burger-ingredient.module.css';
import { useDispatch } from 'react-redux';
import { addIngredient, setBun } from '../../services/burgerSlice'; //импортируем функции добавления булки и ингредиентов
import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';
import { TConstructorIngredient } from '@utils-types';
import { v4 as uuidv4 } from 'uuid'; // библиотека для генерации уникального uuid

/**Этот компонент отвечает за отображение отдельного ингредиента бургера с учетом его количества и информации о текущем маршруте. Он использует оптимизацию через memo, чтобы избежать лишних рендеров.*/

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const location = useLocation();
    const dispatch = useDispatch();

    // Функция для добавления ингредиента в конструктор бургера
    const handleAdd = () => {
      const ingredientWithId = {
        ...ingredient,
        id: uuidv4() // Генерация уникального id для ингредиента
      };

      // Логируем созданный id в консоль
      console.log('Добавляем ингредиент и задаем ему ID:', ingredientWithId);
      console.log('Созданный ID инвгредиента:', ingredientWithId.id);

      if (ingredient.type === 'bun') {
        // Если ингредиент - булка, устанавливаем ее
        dispatch(setBun(ingredientWithId as TConstructorIngredient));
      } else {
        // Если ингредиент - не булка, добавляем его в массив ингредиентов
        dispatch(addIngredient(ingredientWithId as TConstructorIngredient));
      }
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
