import { FC, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';

import { useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../services/store';

import { useParams } from 'react-router-dom';
import { selectOrderByNumber } from '../../services/ordersSlice';

// Компонент OrderInfo
export const OrderInfo: FC = () => {
  /**
   * TODO: взять переменные orderData и ingredients из стора
   */
  // Получаем номер заказа из параметров маршрута
  const { number } = useParams<{ number: string }>();

  /** 
  const orderData = {
    createdAt: '',
    ingredients: [],
    _id: '',
    status: '',
    name: '',
    updatedAt: 'string',
    number: 0
  }; */

  // Проверяем, что номер заказа определен
  const orderData = useSelector((state: RootState) =>
    number ? selectOrderByNumber(state, number) : null
  );

  // Получаем ингредиенты из Redux Store
  const ingredients = useSelector(
    (state: RootState) => state.ingredients.ingredients
  );

  // Логируем полученные ингредиенты
  console.log('Полученные ингредиенты:', ingredients);

  // Данные для отображения
  const orderInfo = useMemo(() => {
    // Проверяем, есть ли данные о заказе и ингредиенты
    if (!orderData || !ingredients.length) return null;

    // Преобразуем дату создания заказа в объект Date
    const date = new Date(orderData.createdAt);
    console.log('Дата создания заказа:', date);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    // Обрабатываем ингредиенты заказа и считаем их количество
    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        // Если ингредиент еще не добавлен в аккумулятор
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1 // Устанавливаем начальное количество
            };
          }
        } else {
          acc[item].count++; // Увеличиваем количество, если ингредиент уже есть
        }

        return acc;
      },
      {}
    );

    // Логируем информацию об ингредиентах
    console.log('Информация об ингредиентах:', ingredientsInfo);

    // Считаем общую стоимость заказа
    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    // Логируем общую стоимость заказа
    console.log('Общая стоимость заказа:', total);

    // Возвращаем полную информацию о заказе с деталями об ингредиентах
    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  // Если нет информации о заказе, показываем прелоадер
  if (!orderInfo) {
    return <Preloader />;
  }

  // Отображаем информацию о заказе через OrderInfoUI
  return <OrderInfoUI orderInfo={orderInfo} />;
};
