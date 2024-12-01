import React from 'react';
import { useSelector } from '../services/store';
import { getIsAuthChecked, getUser } from '../services/userSlice';
import { Navigate, useLocation } from 'react-router-dom';
import { Preloader } from '@ui';

type TProtectedProps = {
  onlyUnAuth?: boolean;
  component: React.JSX.Element;
};

const Protected = ({
  onlyUnAuth = false,
  component
}: TProtectedProps): React.JSX.Element => {
  const isAuthChecked = useSelector(getIsAuthChecked);
  const user = useSelector(getUser);
  const location = useLocation();

  console.log('Protected isAuthChecked:', isAuthChecked);
  console.log('Protected Пользователь:', user);
  console.log('Protected onlyUnAuth:', onlyUnAuth);
  console.log('Protected Местоположение:', location);

  if (!isAuthChecked) {
    console.log(
      'Protected Проверка аутентификации не завершена. Показываем Preloader.'
    );
    return <Preloader />;
  }

  if (!onlyUnAuth && !user) {
    // Маршрут для авторизованного и не авторизован
    console.log(
      'Protected Пользователь не аутентифицирован. Перенаправляем на /login'
    );
    return <Navigate to='/login' state={{ from: location }} />;
  }

  if (onlyUnAuth && user) {
    // Для неавторизованного и авторизован
    const { from } = location.state ?? { from: { pathname: '/' } };
    console.log(
      'Protected Пользователь аутентифицирован. Перенаправляем на:',
      from
    );
    return <Navigate to={from} />;
  }

  // !onlyUnAuth && user
  // onlyUnAuth && !user

  console.log('Protected Рендерим защищенный компонент');
  return component;
};

export const OnlyAuth = Protected;
export const OnlyUnAuth = ({
  component
}: {
  component: React.JSX.Element;
}): React.JSX.Element => <Protected onlyUnAuth component={component} />;
