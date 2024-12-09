import { FC, memo } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import { useDispatch } from 'react-redux';
import {
  moveIngredientUp,
  moveIngredientDown,
  removeIngredient
} from '../../services/burgerSlice';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch();

    const handleMoveDown = () => {
      console.log('Попытка переместить ингредиент вниз: ${ingredient.id}');
      dispatch(moveIngredientDown(ingredient.id));
    };

    const handleMoveUp = () => {
      console.log('Попытка переместить ингредиент вверх: ${ingredient.id}');
      dispatch(moveIngredientUp(ingredient.id));
    };

    const handleClose = () => {
      //  Логика для удаления ингредиента из конструктора
      dispatch(removeIngredient(ingredient.id));
      console.log('Удаление ингредиента: ${ingredient.id}');
    };

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);
