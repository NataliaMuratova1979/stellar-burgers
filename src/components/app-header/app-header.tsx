import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from 'react-redux';
import { selectUserName } from '../../services/userSlice';

export const AppHeader: FC = () => {
  const userName = useSelector(selectUserName) || ''; // Получаем имя пользователя из Redux Store

  return <AppHeaderUI userName={userName} />;
};
