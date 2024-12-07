import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { resetPasswordApi } from '@api';
import { ResetPasswordUI } from '@ui-pages';

// Функциональный компонент для сброса пароля
export const ResetPassword: FC = () => {
  const navigate = useNavigate(); // Хук для навигации между страницами
  const [password, setPassword] = useState(''); // Состояние для хранения нового пароля
  const [token, setToken] = useState(''); // Состояние для хранения токена сброса пароля
  const [error, setError] = useState<Error | null>(null); // Состояние для хранения ошибки

  // Обработчик отправки формы
  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault(); // Предотвращаем перезагрузку страницы
    setError(null); // Сбрасываем предыдущее состояние ошибки
    console.log('Submitting password reset:', { password, token }); // Логируем данные для сброса пароля

    resetPasswordApi({ password, token }) // Вызов API для сброса пароля
      .then(() => {
        console.log('Password reset successful'); // Логируем успешный сброс пароля
        localStorage.removeItem('resetPassword'); // Удаляем токен из локального хранилища
        navigate('/login'); // Перенаправляем пользователя на страницу входа
      })
      .catch((err) => {
        console.error('Error resetting password:', err); // Логируем ошибку при сбросе пароля
        setError(err); // Устанавливаем состояние ошибки
      });
  };

  // Эффект, который срабатывает при загрузке компонента
  useEffect(() => {
    // Проверяем наличие токена в локальном хранилище
    if (!localStorage.getItem('resetPassword')) {
      navigate('/forgot-password', { replace: true }); // Перенаправляем на страницу восстановления пароля
    }
  }, [navigate]);

  return (
    <ResetPasswordUI
      errorText={error?.message} // Передаем текст ошибки в UI компонент
      password={password} // Передаем текущее значение пароля
      token={token} // Передаем текущее значение токена
      setPassword={setPassword} // Передаем функцию для обновления состояния пароля
      setToken={setToken} // Передаем функцию для обновления состояния токена
      handleSubmit={handleSubmit} // Передаем обработчик отправки формы
    />
  );
};
