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
  const user = useSelector(getUser);

  useEffect(() => {
    dispatch(checkUserAuth());
  }, [dispatch]);

  const onOrderClick = () => {
    if (!isAuthChecked) {
      return;
    }

    if (!user) {
      navigate('/login');
      return;
    }

    if (!constructorItems.bun || orderRequest) {
      return;
    }

    const ingredientIds: string[] = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map(
        (ingredient: TConstructorIngredient) => ingredient._id
      )
    ];

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
        dispatch(setOrderRequest(false));
      });
  };

  const closeOrderModal = () => {
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
