import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders } from '../../services/ordersSlice';
import { RootState, AppDispatch } from '../../services/store'; // Путь к вашему store

import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';
import {
  selectOrders,
  selectTotalOrders,
  selectTotalToday
} from '../../services/ordersSlice'; // Импортируем селекторы

// Функция для фильтрации заказов по статусу
const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  const dispatch: AppDispatch = useDispatch(); // Указываем тип для dispatch
  const orders = useSelector(selectOrders); // Используем селектор для получения заказов
  const total = useSelector(selectTotalOrders); // Используем селектор для получения общего числа заказов
  const totalToday = useSelector(selectTotalToday); // Используем селектор для получения общего числа заказов сегодня

  console.log('FeedIndo, Текущие заказы:', orders);
  console.log('FeedIndo, Всего заказов:', total);
  console.log('FeedIndo, Всего заказов сегодня:', totalToday);

  const readyOrders = getOrders(orders, 'done'); // Получаем готовые заказы
  const pendingOrders = getOrders(orders, 'pending'); // Получаем ожидающие заказы

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={{ total, totalToday }}
    />
  );
};
