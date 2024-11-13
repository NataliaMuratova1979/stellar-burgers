import { FC } from 'react';
import { useLocation } from 'react-router-dom';
import { ProfileMenuUI } from '@ui';
import { useDispatch } from 'react-redux';
import { logout } from '../../services/userSlice';
import { AppDispatch } from '../../services/store'; // Импортируйте ваш тип dispatch

export const ProfileMenu: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { pathname } = useLocation();

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap(); // unwrap должен работать правильно
      console.log('Пользователь вышел');
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Ошибка выхода:', error.message);
      } else {
        console.error('Ошибка выхода:', error);
      }
    }
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
