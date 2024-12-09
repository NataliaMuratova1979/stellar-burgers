import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchOrders,
  selectOrders,
  selectLoading,
  selectError
} from '../../services/ordersSlice';
import { AppDispatch, RootState } from '../../services/store';

export const Feed: FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const orders: TOrder[] = useSelector((state: RootState) =>
    selectOrders(state)
  );
  const loading = useSelector((state: RootState) => selectLoading(state));
  const error = useSelector((state: RootState) => selectError(state));

  // Загрузка заказов при монтировании компонента
  useEffect(() => {
    console.log('Отправка запроса на получение заказов...');
    dispatch(fetchOrders());
  }, []); // Пустой массив

  // Функция для обновления списка заказов
  const handleGetFeeds = () => {
    dispatch(fetchOrders());
    console.log('обновление, работает функция handleGetFeeds');
  };

  console.log('компонент Feed, Текущие заказы:', orders);

  // Обработка состояния загрузки и ошибок
  if (loading) {
    return <Preloader />;
  }

  if (error) {
    return <div>Произошла ошибка: {error}</div>; // Отображение ошибки
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
