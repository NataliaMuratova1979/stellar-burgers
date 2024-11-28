import { FC, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TConstructorIngredient, TOrder } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import {
  setOrderRequest,
  clearConstructor,
  setOrderModalData,
  placeOrder
} from '../../services/burgerSlice';
import { checkTokenStatus } from '../../utils/tokens'; // Импортируйте функцию проверки токенов

import { RootState, AppDispatch } from '../../services/store';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  const constructorItems = useSelector(
    (state: RootState) => state.burger.constructorItems
  );
  const orderRequest = useSelector(
    (state: RootState) => state.burger.orderRequest
  );
  const orderModalData = useSelector(
    (state: RootState) => state.burger.orderModalData
  );

  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const onOrderClick = () => {
    const { isAccessTokenValid, isRefreshTokenValid } = checkTokenStatus();

    if (!isAccessTokenValid) {
      console.log(
        'Токен доступа недействителен. Перенаправление на страницу входа.'
      );
      navigate('/login');
      return;
    }

    if (!constructorItems.bun || orderRequest) {
      console.log(
        'Нет булки или запрос уже отправлен. Отмена оформления заказа.'
      );
      return;
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
