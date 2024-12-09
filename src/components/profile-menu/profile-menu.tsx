import { FC } from 'react';
import { useLocation } from 'react-router-dom';
import { ProfileMenuUI } from '@ui';
import { useDispatch } from 'react-redux';
import { logout } from '../../services/userSlice';
import { AppDispatch } from '../../services/store';
import { clearTokens } from '../../utils/tokens';

export const ProfileMenu: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { pathname } = useLocation();

  const handleLogout = () => {
    dispatch(logout())
      .unwrap()
      .then(() => {
        console.log('Пользователь вышел');
        clearTokens(); // Очищаем токены после выхода
      })
      .catch((error: unknown) => {
        if (error instanceof Error) {
          console.error('Ошибка выхода:', error.message);
        } else {
          console.error('Ошибка выхода:', error);
        }
      });
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
