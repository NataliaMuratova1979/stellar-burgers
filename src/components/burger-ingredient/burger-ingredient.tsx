import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';

import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';

/**Этот компонент отвечает за отображение отдельного ингредиента бургера с учетом его количества и информации о текущем маршруте. Он использует оптимизацию через memo, чтобы избежать лишних рендеров. В текущем виде функция для добавления ингредиента еще не реализована, но предполагается, что она будет добавлена в будущем. */

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const location = useLocation();

    const handleAdd = () => {};

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
