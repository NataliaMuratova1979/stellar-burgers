import { updateUser } from '../../services/userSlice'; // Импортируем действие для обновления пользователя
import { useDispatch, useSelector } from '../../services/store'; // Импортируем хуки для работы с Redux
import { ProfileUI } from '@ui-pages'; // Импортируем компонент пользовательского интерфейса профиля
import { FC, SyntheticEvent, useEffect, useState } from 'react'; // Импортируем необходимые хуки и типы из React
import { RootState } from 'src/services/store'; // Импортируем тип корневого состояния Redux

// Определяем функциональный компонент Profile
export const Profile: FC = () => {
  // Получаем данные пользователя из Redux-хранилища
  const { data: user } = useSelector((store: RootState) => store.user);
  const dispatch = useDispatch(); // Получаем функцию dispatch для отправки действий

  // Устанавливаем начальное состояние формы с учетом возможного null
  const [formValue, setFormValue] = useState({
    name: user?.name || '', // Используем оператор опциональной цепочки
    email: user?.email || '',
    password: ''
  });

  // Состояние для хранения начальных значений пользователя
  const [initialValues, setInitialValues] = useState(formValue);

  // Эффект для обновления состояния формы при изменении данных пользователя
  useEffect(() => {
    console.log('User data updated:', user); // Логируем обновленные данные пользователя
    setFormValue((prevState) => ({
      ...prevState,
      name: user?.name || '', // Обновляем имя пользователя в состоянии формы
      email: user?.email || '' // Обновляем email пользователя в состоянии формы
    }));
  }, [user]); // Зависимость от данных пользователя

  // Проверяем, были ли изменения в форме по сравнению с данными пользователя
  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  console.log('Is form changed:', isFormChanged); // Логируем состояние формы (изменена или нет)

  // Обработчик отправки формы
  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault(); // Предотвращаем стандартное поведение формы
    console.log('Form submitted with values:', formValue); // Логируем значения формы при отправке
    dispatch(updateUser(formValue)); // Отправляем действие для обновления пользователя с новыми значениями формы
  };

  // Обработчик для сброса формы к начальному состоянию
  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault(); // Предотвращаем стандартное поведение
    console.log('Form reset to initial values'); // Логируем сброс формы

    // Сбрасываем форму к начальным значениям
    setFormValue(initialValues);
  };

  // Обработчик изменения значений в полях ввода формы
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value // Обновляем значение поля в состоянии формы по имени поля
    }));
  };

  // Возвращаем компонент интерфейса профиля с необходимыми пропсами
  return (
    <ProfileUI
      formValue={formValue} // Передаем значения формы
      isFormChanged={isFormChanged} // Передаем состояние изменения формы
      handleCancel={handleCancel} // Передаем обработчик сброса формы
      handleSubmit={handleSubmit} // Передаем обработчик отправки формы
      handleInputChange={handleInputChange} // Передаем обработчик изменения ввода
    />
  );
};
