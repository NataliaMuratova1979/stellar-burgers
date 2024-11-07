import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders } from '../../services/ordersSlice'; // Путь к вашему слайсу
import { RootState, AppDispatch } from '../../services/store'; // Путь к вашему store

import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';

/** Этот компонент предназначен для отображения информации о заказах */

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  const dispatch: AppDispatch = useDispatch(); // Указываем тип для dispatch
  const { orders, total, totalToday } = useSelector(
    (state: RootState) => state.orders
  );

  useEffect(() => {
    console.log('Dispatching fetchOrders...');
    dispatch(fetchOrders() as any); // Приведение типа может помочь, если вы хотите временно обойти ошибку
  }, [dispatch]);

  console.log('Current orders:', orders);
  console.log('Total orders:', total);
  console.log('Total today:', totalToday);

  const readyOrders = getOrders(orders, 'done');
  const pendingOrders = getOrders(orders, 'pending');

  console.log('Ready orders:', readyOrders);
  console.log('Pending orders:', pendingOrders);

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={{ total, totalToday }}
    />
  );
};
