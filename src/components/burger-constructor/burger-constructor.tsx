import { FC, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TConstructorIngredient, TOrder } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import {
  setOrderRequest,
  clearConstructor,
  setOrderModalData,
  placeOrder
} from '../../services/burgerSlice';
import {
  checkUserAuth,
  getIsAuthChecked,
  getUser
} from '../../services/userSlice';

import { RootState, AppDispatch } from '../../services/store';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const constructorItems = useSelector(
    (state: RootState) => state.burger.constructorItems
  );
  const orderRequest = useSelector(
    (state: RootState) => state.burger.orderRequest
  );
  const orderModalData = useSelector(
    (state: RootState) => state.burger.orderModalData
  );
  const isAuthChecked = useSelector(getIsAuthChecked);
  const user = useSelector(getUser); // Получаем информацию о пользователе

  useEffect(() => {
    console.log('Проверка авторизации пользователя...');
    dispatch(checkUserAuth());
  }, [dispatch]);

  const onOrderClick = () => {
    console.log('Кнопка "Оформить заказ" нажата.');

    if (!isAuthChecked) {
      console.log('Аутентификация еще не проверена. Выход из функции.');
      return; // Если аутентификация еще не проверена, выходим из функции
    }

    if (!user) {
      console.log('Пользователь не авторизован. Перенаправление на /login');
      navigate('/login');
      return;
    }

    if (!constructorItems.bun || orderRequest) {
      console.log('Нет булки или запрос уже отправлен. Выход из функции.');
      return; // Если нет булки или запрос уже отправлен, выходим из функции
    }

    const ingredientIds: string[] = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map(
        (ingredient: TConstructorIngredient) => ingredient._id
      )
    ];

    console.log(
      'Отправка запроса на оформление заказа с ингредиентами:',
      ingredientIds
    );

    dispatch(setOrderRequest(true));

    dispatch(placeOrder(ingredientIds))
      .unwrap()
      .then((orderData: TOrder) => {
        console.log('Заказ успешно оформлен:', orderData);
        dispatch(setOrderModalData(orderData));
      })
      .catch((error: unknown) => {
        console.error('Ошибка при оформлении заказа:', error);
      })
      .finally(() => {
        console.log('Запрос на оформление заказа завершен.');
        dispatch(setOrderRequest(false));
      });
  };

  const closeOrderModal = () => {
    console.log('Закрытие модального окна заказа.');
    dispatch(clearConstructor());
    dispatch(setOrderModalData(null));
  };

  const price = useMemo(() => {
    const calculatedPrice =
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      );
    console.log('Расчет цены заказа:', calculatedPrice);
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
