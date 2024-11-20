import { FC, useEffect, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';

import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../services/store'; // Убедитесь, что AppDispatch экспортируется из вашего store
import { useParams } from 'react-router-dom';
import {
  selectOrderNumberData,
  fetchOrderByNumber
} from '../../services/orderNumberSlice';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const dispatch = useDispatch<AppDispatch>(); // Используем типизированный dispatch

  // Приводим номер заказа к числу
  const orderNumber = Number(number);

  // Используем селектор для получения данных о заказе
  const orderData = useSelector((state: RootState) =>
    selectOrderNumberData(state, orderNumber)
  );

  // Получаем список ингредиентов из состояния
  const ingredients = useSelector(
    (state: RootState) => state.ingredients.ingredients
  );

  // Эффект для загрузки данных о заказе при первом рендере
  useEffect(() => {
    if (!orderData) {
      dispatch(fetchOrderByNumber(orderNumber)); // Теперь TypeScript должен понимать, что это thunk action
    }
  }, [dispatch, orderData, orderNumber]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
