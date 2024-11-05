import { FC, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux'; // Импортируем хуки
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import {
  setOrderRequest,
  clearConstructor,
  setOrderModalData
} from '../../services/burgerSlice'; // Импортируем действия из burgerSlice

export const BurgerConstructor: FC = () => {
  // Получаем состояние из Redux
  const constructorItems = useSelector(
    (state: any) => state.burger.constructorItems
  );
  const orderRequest = useSelector((state: any) => state.burger.orderRequest);
  const orderModalData = useSelector(
    (state: any) => state.burger.orderModalData
  );

  const dispatch = useDispatch(); // Инициализируем dispatch

  console.log('Constructor Items:', constructorItems);
  console.log('Order Request Status:', orderRequest);
  console.log('Order Modal Data:', orderModalData);

  const onOrderClick = () => {
    console.log('Order button clicked');

    if (!constructorItems.bun || orderRequest) {
      console.log(
        'Order cannot be placed. Bun is missing or request is in progress.'
      );
      return;
    }

    dispatch(setOrderRequest(true)); // Устанавливаем статус запроса на оформление заказа
    console.log('Order request initiated');

    // После успешного оформления заказа можно установить данные о заказе
    // dispatch(setOrderModalData(orderData)); // Пример установки данных о заказе
  };

  const closeOrderModal = () => {
    console.log('Closing order modal');
    dispatch(clearConstructor()); // Очищаем конструктор
    dispatch(setOrderModalData(null)); // Закрываем модальное окно заказа
  };

  const price = useMemo(() => {
    const calculatedPrice =
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      );
    console.log('Calculated Price:', calculatedPrice);
    return calculatedPrice;
  }, [constructorItems]);

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};

/**import React, { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';

import { useDispatch, useSelector } from 'react-redux';
import {
  addBun,
  addIngredient,
  removeIngredient,
  clearConstructor
} from '../../services/constructorSlice';
import { RootState } from '../../services/store';
import { makeSelectConstructor } from '../../services/constructorSelectors'; // Проверьте путь к селектору

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();

  const constructorItems = useSelector(makeSelectConstructor) as {
    bun: TConstructorIngredient | null;
    ingredients: TConstructorIngredient[];
  };

  const orderRequest = false;

  const orderModalData = null;

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
    // Логика обработки заказа
  };

  const closeOrderModal = () => {
    // Логика закрытия модального окна заказа
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
}; */

/**▎
 * 1. constructorItems
• Описание: Это объект, который содержит информацию о выбранных пользователем ингредиентах и булках для бургера. Обычно он включает в себя:
  • bun: объект, представляющий булку (свойства могут включать name, price, image и т.д.).
  • ingredients: массив объектов, представляющих выбранные ингредиенты (например, мясо, овощи, соусы) 
  
  ▎2. orderRequest
• Описание: Это булевое значение, которое указывает на то, идет ли в данный момент процесс оформления заказа. Если значение true, это может означать, что пользователь нажал кнопку "Оформить заказ", и приложение ожидает ответа от сервера.

▎3. orderModalData
• Описание: Это объект, который содержит данные о заказе, если он был успешно оформлен. Например, он может включать номер заказа или другие детали. Если данные отсутствуют (например, заказ еще не оформлен), то это значение будет null или undefined.
  
  */

/**
export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора 
  const constructorItems = {
    bun: {
      price: 0
    },
    ingredients: []
  };

  const orderRequest = false;

  const orderModalData = null;

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
  };
  const closeOrderModal = () => {};

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return null;

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
}; */
