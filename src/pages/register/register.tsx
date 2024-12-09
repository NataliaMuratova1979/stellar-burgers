import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../services/userSlice';
import { RootState } from '../../services/store';
import { AppDispatch } from '../../services/store';

export const Register: FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Состояния для хранения данных формы
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Получаем состояние загрузки и ошибки из Redux
  // const { loading } = useSelector((state: RootState) => state.user);

  // Обработчик отправки формы
  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    try {
      await dispatch(
        registerUser({ name: userName, email, password })
      ).unwrap();
      console.log('Registration successful!'); // Логируем успешную регистрацию
      // Здесь можно добавить логику после успешной регистрации, если необходимо
    } catch (err) {
      console.error('Registration failed:', err); // Логируем ошибку при регистрации
      setErrorMessage('Registration failed. Please try again.'); // Устанавливаем сообщение об ошибке
    }
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
