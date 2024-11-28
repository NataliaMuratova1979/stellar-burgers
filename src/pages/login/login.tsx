import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';

import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../services/userSlice';
import { RootState } from '../../services/store';

import { useLocation } from 'react-router-dom';
import { AppDispatch } from '../../services/store';

export const Login: FC = () => {
  // Локальные состояния для хранения email и пароля
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Получаем dispatch для отправки действий в Redux
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();

  // Определяем путь для перенаправления после входа (но не используем)
  const from = location.state?.from || '/'; // Задаем путь по умолчанию

  // Извлечение состояния загрузки и ошибки из Redux
  const { loading, error } = useSelector((state: RootState) => state.user);

  // Обработчик отправки формы
  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault(); // Предотвращаем перезагрузку страницы
    console.log('Attempting to log in with:', { email, password }); // Логируем данные для входа

    try {
      // Отправляем действие для логина пользователя
      await dispatch(loginUser({ email, password })).unwrap();
      console.log('Login successful!'); // Логируем успешный вход
      // Здесь можно добавить логику после успешного логина, если необходимо
    } catch (err) {
      console.error('Login failed:', err); // Логируем ошибку при входе
    }
  };

  return (
    <LoginUI
      errorText=''
      email={email} // Передаем значение email в UI
      setEmail={setEmail} // Передаем функцию для обновления email в UI
      password={password} // Передаем значение пароля в UI
      setPassword={setPassword} // Передаем функцию для обновления пароля в UI
      handleSubmit={handleSubmit} // Передаем обработчик отправки формы в UI
    />
  );
};
