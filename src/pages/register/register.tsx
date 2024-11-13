import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../services/userSlice'; // Импортируйте ваше действие регистрации
import { RootState } from '../../services/store';
import { useNavigate } from 'react-router-dom';
import { AppDispatch } from '../../services/store'; // Импортируйте ваш тип AppDispatch

export const Register: FC = () => {
  // Используем useDispatch для получения метода dispatch из Redux
  const dispatch = useDispatch<AppDispatch>();
  // Используем useNavigate для навигации между страницами
  const navigate = useNavigate();

  // Состояния для хранения данных формы
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Получаем состояние загрузки и ошибки из Redux
  const { loading } = useSelector((state: RootState) => state.user);

  // Обработчик отправки формы
  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    try {
      await dispatch(
        registerUser({ name: userName, email, password })
      ).unwrap();

      navigate('/profile', { replace: true });
    } catch (_) {}
  };

  return (
    <RegisterUI
      errorText={errorMessage} // Передаем текст ошибки в компонент UI
      email={email} // Передаем email в компонент UI
      userName={userName} // Передаем имя пользователя в компонент UI
      password={password} // Передаем пароль в компонент UI
      setEmail={setEmail} // Функция для обновления email
      setPassword={setPassword} // Функция для обновления пароля
      setUserName={setUserName} // Функция для обновления имени пользователя
      handleSubmit={handleSubmit} // Функция для обработки отправки формы
    />
  );
};
