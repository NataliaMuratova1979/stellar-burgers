import { FC, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux'; // Импортируем хуки
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import {
  setOrderRequest,
  clearConstructor,
  setOrderModalData
} from '../../services/burgerSlice'; // Импортируем действия из burgerSlice

import { useNavigate } from 'react-router-dom'; // Импортируем хук для навигации

export const BurgerConstructor: FC = () => {
  // Получаем состояние из Redux
  const constructorItems = useSelector(
    (state: any) => state.burger.constructorItems
  );
  const orderRequest = useSelector((state: any) => state.burger.orderRequest);
  const orderModalData = useSelector(
    (state: any) => state.burger.orderModalData
  );

  const isAuthenticated = useSelector(
    (state: any) => state.user.isAuthenticated
  ); // Получаем состояние авторизации

  const dispatch = useDispatch(); // Инициализируем dispatch
  const navigate = useNavigate(); // Инициализируем хук навигации

  console.log('Constructor Items:', constructorItems);
  console.log('Order Request Status:', orderRequest);
  console.log('Order Modal Data:', orderModalData);

  const onOrderClick = () => {
    console.log('Order button clicked');

    if (!isAuthenticated) {
      // Проверяем, авторизован ли пользователь
      console.log('User is not authenticated, redirecting to login');
      navigate('/login'); // Перенаправляем на страницу входа
      return;
    }

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
