import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import React, { FC, useEffect } from 'react'; // Импортируем React и useEffect

import { useDispatch, useSelector } from 'react-redux';
import {
  fetchOrders,
  selectOrders,
  selectLoading,
  selectError
} from '../../services/usersOrdersSlice';

import { AppDispatch } from '../../services/store';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Получаем заказы, состояние загрузки и ошибки из Redux-хранилища

  const orders: TOrder[] = useSelector(selectOrders);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);

  useEffect(() => {
    dispatch(fetchOrders()); // Загружаем заказы при монтировании компонента
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>; // Показываем индикатор загрузки
  }

  if (error) {
    return <div>Error: {error}</div>; // Показываем сообщение об ошибке, если есть
  }

  return <ProfileOrdersUI orders={orders} />; // Отображаем заказы в UI-компоненте
};
