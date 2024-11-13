import { deleteCookie, setCookie } from './cookie';

export const storeTokens = (refreshToken: string, accessToken: string) => {
  console.log('Сохранение токенов...');

  localStorage.setItem('refreshToken', String(refreshToken));
  setCookie('accessToken', String(accessToken));

  console.log('Токены успешно сохранены.');
};

export const clearTokens = () => {
  console.log('Очистка токенов...');

  localStorage.removeItem('refreshToken');
  deleteCookie('accessToken');

  console.log('Токены успешно очищены.');
};
