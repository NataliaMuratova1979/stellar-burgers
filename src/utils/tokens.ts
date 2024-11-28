import { deleteCookie, setCookie, getCookie } from './cookie';

/**
 * Сохраняет токены в localStorage и cookie.
 * @param refreshToken - Токен обновления.
 * @param accessToken - Токен доступа.
 */
export const storeTokens = (refreshToken: string, accessToken: string) => {
  console.log('tokens Сохранение токенов...'); // Логируем сообщение о начале сохранения токенов

  // Сохраняем токен обновления в localStorage
  localStorage.setItem('refreshToken', String(refreshToken)); // Преобразуем refreshToken в строку и сохраняем его в localStorage

  // Сохраняем токен доступа в cookie
  setCookie('accessToken', String(accessToken)); // Преобразуем accessToken в строку и сохраняем его в cookie

  console.log('tokens Токены успешно сохранены.'); // Логируем сообщение об успешном сохранении токенов
};

export const clearTokens = () => {
  console.log('Очистка токенов...'); // Логируем сообщение о начале очистки токенов

  // Удаляем токен обновления из localStorage
  localStorage.removeItem('refreshToken'); // Удаляем refreshToken из localStorage

  // Удаляем токен доступа из cookie
  deleteCookie('accessToken'); // Удаляем accessToken из cookie

  console.log('tokens Токены успешно очищены.'); // Логируем сообщение об успешной очистке токенов
};

/**
 * Получает токен обновления из localStorage.
 * @returns Токен обновления или null, если он не найден.
 */
export const getRefreshToken = (): string | null =>
  localStorage.getItem('refreshToken'); // Возвращаем refreshToken из localStorage или null, если он не найден

/**
 * Получает токен доступа из cookie.
 * @returns Токен доступа или null, если он не найден.
 */
export const getAccessToken = (): string | null =>
  getCookie('accessToken') || null; // Используем getCookie для получения accessToken из cookie, возвращаем null, если он не найден

/**
 * Проверяет, истек ли токен доступа.
 * @param token - Токен доступа.
 * @returns true, если токен истек, иначе false.
 */
export const isAccessTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1])); // Декодируем и парсим полезную нагрузку токена
    return payload.exp < Date.now() / 1000; // Проверяем, истек ли срок действия токена
  } catch (error) {
    console.error('tokens Ошибка при проверке срока действия токена:', error); // Логируем ошибку, если произошла ошибка при проверке
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
  console.log('tokens Обновление токенов...'); // Логируем сообщение о начале обновления токенов

  clearTokens(); // Сначала очищаем старые токены
  storeTokens(newRefreshToken, newAccessToken); // Сохраняем новые токены

  console.log('Токены успешно обновлены.'); // Логируем сообщение об успешном обновлении токенов
};

/**
 * Проверяет состояние токенов.
 * @returns Объект с состоянием токенов.
 */
export const checkTokenStatus = () => {
  const accessToken = getAccessToken(); // Получаем текущий токен доступа
  const refreshToken = getRefreshToken(); // Получаем текущий токен обновления

  const isAccessTokenValid = accessToken && !isAccessTokenExpired(accessToken); // Проверяем действительность токена доступа
  const isRefreshTokenValid = !!refreshToken; // Проверяем наличие токена обновления

  return {
    isAccessTokenValid, // Возвращаем результат проверки действительности токена доступа
    isRefreshTokenValid, // Возвращаем результат проверки наличия токена обновления
    accessToken, // Возвращаем сам токен доступа
    refreshToken // Возвращаем сам токен обновления
  };
};
