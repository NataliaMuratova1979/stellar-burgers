import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import React, { FC, useEffect } from 'react'; // Импортируем React и useEffect

import { useDispatch, useSelector } from 'react-redux';
import {
  fetchUsersOrders,
  selectUsersOrders,
  selectUsersLoading,
  selectUsersError
} from '../../services/usersOrdersSlice';

import { AppDispatch, RootState } from '../../services/store';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Получаем заказы, состояние загрузки и ошибки из Redux-хранилища

  const userOrders: TOrder[] = useSelector((state: RootState) =>
    selectUsersOrders(state)
  );

  const loading = useSelector((state: RootState) => selectUsersLoading(state));
  const error = useSelector((state: RootState) => selectUsersError(state));

  useEffect(() => {
    console.log('Отправка запроса на получение заказов...');
    dispatch(fetchUsersOrders()); // Загружаем заказы при монтировании компонента
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Показываем индикатор загрузки
  }

  if (error) {
    return <div>Error: {error}</div>; // Показываем сообщение об ошибке, если есть
  }
  console.log('Заказы компонента profile-Orders:', userOrders); // тут не отображаются заказы!!!

  return <ProfileOrdersUI orders={userOrders} />; // Отображаем заказы в UI-компоненте
};
