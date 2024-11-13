import { updateUser } from '../../services/userSlice';
import { useDispatch, useSelector } from '../../services/store';
import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { RootState } from 'src/services/store';

export const Profile: FC = () => {
  const { data: user } = useSelector((store: RootState) => store.user);
  const dispatch = useDispatch();

  const [formValue, setFormValue] = useState({
    name: user.name,
    email: user.email,
    password: ''
  });

  useEffect(() => {
    console.log('User data updated:', user); // Логируем обновленные данные пользователя
    setFormValue((prevState) => ({
      ...prevState,
      name: user?.name || '',
      email: user?.email || ''
    }));
  }, [user]);

  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  console.log('Is form changed:', isFormChanged); // Логируем состояние формы

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    console.log('Form submitted with values:', formValue); // Логируем значения формы при отправке
    dispatch(updateUser(formValue));
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    console.log('Form reset to initial values'); // Логируем сброс формы
    setFormValue({
      name: user.name,
      email: user.email,
      password: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
