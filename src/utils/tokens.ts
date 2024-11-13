import { deleteCookie, setCookie, getCookie } from './cookie';

/**
 * Сохраняет токены в localStorage и cookie.
 * @param refreshToken - Токен обновления.
 * @param accessToken - Токен доступа.
 */
export const storeTokens = (refreshToken: string, accessToken: string) => {
  console.log('Сохранение токенов...');

  // Сохраняем токен обновления в localStorage
  localStorage.setItem('refreshToken', String(refreshToken));

  // Сохраняем токен доступа в cookie
  setCookie('accessToken', String(accessToken));

  console.log('Токены успешно сохранены.');
};

export const clearTokens = () => {
  console.log('Очистка токенов...');

  // Удаляем токен обновления из localStorage
  localStorage.removeItem('refreshToken');

  // Удаляем токен доступа из cookie
  deleteCookie('accessToken');

  console.log('Токены успешно очищены.');
};

/**
 * Получает токен обновления из localStorage.
 * @returns Токен обновления или null, если он не найден.
 */
export const getRefreshToken = (): string | null =>
  localStorage.getItem('refreshToken');

/**
 * Получает токен доступа из cookie.
 * @returns Токен доступа или null, если он не найден.
 */
export const getAccessToken = (): string | null =>
  getCookie('accessToken') || null; // Используем getCookie для получения токена

/**
 * Проверяет, истек ли токен доступа.
 * @param token - Токен доступа.
 * @returns true, если токен истек, иначе false.
 */
export const isAccessTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp < Date.now() / 1000;
  } catch (error) {
    console.error('Ошибка при проверке срока действия токена:', error);
    return true; // Если произошла ошибка, считаем токен истекшим
  }
};

/**
 * Обновляет токены.
 * Вызывается при необходимости обновить токены (например, когда токен доступа истек).
 * @param newRefreshToken - Новый токен обновления.
 * @param newAccessToken - Новый токен доступа.
 */
export const updateTokens = (
  newRefreshToken: string,
  newAccessToken: string
) => {
  console.log('Обновление токенов...');

  clearTokens(); // Сначала очищаем старые токены
  storeTokens(newRefreshToken, newAccessToken); // Сохраняем новые токены

  console.log('Токены успешно обновлены.');
};
