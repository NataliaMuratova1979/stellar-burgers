import { setCookie, getCookie } from './cookie';
import { TIngredient, TOrder, TOrdersData, TUser } from './types';

const URL = process.env.BURGER_API_URL;

const checkResponse = <T>(res: Response): Promise<T> =>
  res.ok ? res.json() : res.json().then((err) => Promise.reject(err));

type TServerResponse<T> = {
  success: boolean;
} & T;

type TRefreshResponse = TServerResponse<{
  refreshToken: string;
  accessToken: string;
}>;

//Этот код представляет собой функцию refreshToken, которая отправляет POST-запрос на сервер для обновления токена доступа с использованием refresh-токена, хранящегося в локальном хранилище браузера.
export const refreshToken = (): Promise<TRefreshResponse> =>
  fetch(`${URL}/auth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({
      token: localStorage.getItem('refreshToken')
    })
  })
    .then((res) => checkResponse<TRefreshResponse>(res))
    .then((refreshData) => {
      if (!refreshData.success) {
        return Promise.reject(refreshData);
      }
      localStorage.setItem('refreshToken', refreshData.refreshToken);
      setCookie('accessToken', refreshData.accessToken);
      return refreshData;
    });

//Код  представляет собой функцию fetchWithRefresh, которая выполняет HTTP-запрос с обработкой возможного истечения токена доступа (JWT).
// Экспортируем асинхронную функцию fetchWithRefresh, которая выполняет HTTP-запрос с обработкой возможного истечения токена доступа (JWT)
export const fetchWithRefresh = async <T>(
  url: RequestInfo, // URL запроса
  options: RequestInit // Опции запроса (метод, заголовки и т.д.)
) => {
  try {
    // Выполняем HTTP-запрос с использованием fetch и ждем ответа
    const res = await fetch(url, options);
    // Обрабатываем ответ с помощью функции checkResponse и возвращаем результат
    return await checkResponse<T>(res);
  } catch (err) {
    // Обрабатываем возможные ошибки при выполнении запроса
    if ((err as { message: string }).message === 'jwt expired') {
      // Если ошибка связана с истечением срока действия JWT токена
      const refreshData = await refreshToken(); // Обновляем токен, вызывая функцию refreshToken()
      // Проверяем, есть ли заголовки в опциях запроса
      if (options.headers) {
        // Если заголовки существуют, обновляем заголовок authorization новым access-токеном
        (options.headers as { [key: string]: string }).authorization =
          refreshData.accessToken;
      }
      // Повторяем HTTP-запрос с обновленным токеном
      const res = await fetch(url, options);
      // Обрабатываем ответ повторного запроса и возвращаем результат
      return await checkResponse<T>(res);
    } else {
      // Если ошибка не связана с истечением токена, отклоняем промис с ошибкой
      return Promise.reject(err);
    }
  }
};

type TIngredientsResponse = TServerResponse<{
  data: TIngredient[];
}>;

type TFeedsResponse = TServerResponse<{
  orders: TOrder[];
  total: number;
  totalToday: number;
}>;

type TOrdersResponse = TServerResponse<{
  data: TOrder[];
}>;

//Функция getIngredientsApi предназначена для получения списка ингредиентов из API.
export const getIngredientsApi = () =>
  fetch(`${URL}/ingredients`)
    .then((res) => checkResponse<TIngredientsResponse>(res))
    .then((data) => {
      if (data?.success) return data.data;
      return Promise.reject(data);
    });

// Эта функция выполняет HTTP-запрос для получения всех заказов (feeds).
export const getFeedsApi = () =>
  fetch(`${URL}/orders/all`)
    .then((res) => checkResponse<TFeedsResponse>(res))
    .then((data) => {
      if (data?.success) return data;
      return Promise.reject(data);
    });

//Функция getOrdersApi предназначена для получения списка заказов из API с использованием функции fetchWithRefresh.
export const getOrdersApi = () =>
  fetchWithRefresh<TFeedsResponse>(`${URL}/orders`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      authorization: getCookie('accessToken')
    } as HeadersInit
  }).then((data) => {
    if (data?.success) return data.orders;
    return Promise.reject(data);
  });

//тип TNewOrderResponse представляет собой ответ от сервера, связанный с созданием нового заказа
type TNewOrderResponse = TServerResponse<{
  order: TOrder;
  name: string;
}>;

//Функция orderBurgerApi предназначена для отправки нового заказа на сервер с использованием API.
export const orderBurgerApi = (data: string[]) =>
  fetchWithRefresh<TNewOrderResponse>(`${URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      authorization: getCookie('accessToken')
    } as HeadersInit,
    body: JSON.stringify({
      ingredients: data
    })
  }).then((data) => {
    if (data?.success) return data;
    return Promise.reject(data);
  });

//тип данных заказов, возвращаемых сервером.
type TOrderResponse = TServerResponse<{
  orders: TOrder[];
}>;

//Функция getOrderByNumberApi предназначена для получения информации о заказе по его номеру с использованием API.
export const getOrderByNumberApi = (number: number) =>
  fetch(`${URL}/orders/${number}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then((res) => checkResponse<TOrderResponse>(res));

// Определяем тип данных для регистрации нового пользователя
export type TRegisterData = {
  email: string;
  name: string;
  password: string;
};

// Определяем тип ответа от сервера при аутентификации
type TAuthResponse = TServerResponse<{
  refreshToken: string;
  accessToken: string;
  user: TUser;
}>;

//Функция registerUserApi предназначена для регистрации нового пользователя через API.
export const registerUserApi = (data: TRegisterData) =>
  fetch(`${URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  })
    .then((res) => checkResponse<TAuthResponse>(res))
    .then((data) => {
      if (data?.success) return data;
      return Promise.reject(data);
    });

// Определяем тип данных для входа пользователя
export type TLoginData = {
  email: string;
  password: string;
};

//Функция loginUserApi предназначена для выполнения входа пользователя через API.
export const loginUserApi = (data: TLoginData) =>
  fetch(`${URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  })
    .then((res) => checkResponse<TAuthResponse>(res))
    .then((data) => {
      if (data?.success) return data;
      return Promise.reject(data);
    });

//Функция forgotPasswordApi предназначена для обработки запроса на восстановление пароля пользователя через API.
export const forgotPasswordApi = (data: { email: string }) =>
  fetch(`${URL}/password-reset`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  })
    .then((res) => checkResponse<TServerResponse<{}>>(res))
    .then((data) => {
      if (data?.success) return data;
      return Promise.reject(data);
    });

//Функция resetPasswordApi предназначена для выполнения запроса на сброс пароля пользователя через API.
export const resetPasswordApi = (data: { password: string; token: string }) =>
  fetch(`${URL}/password-reset/reset`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  })
    .then((res) => checkResponse<TServerResponse<{}>>(res))
    .then((data) => {
      if (data?.success) return data;
      return Promise.reject(data);
    });

// Определяем тип ответа от сервера для получения данных пользователя
type TUserResponse = TServerResponse<{ user: TUser }>;

//Функция getUserApi предназначена для получения информации о пользователе через API.
export const getUserApi = () =>
  fetchWithRefresh<TUserResponse>(`${URL}/auth/user`, {
    headers: {
      authorization: getCookie('accessToken')
    } as HeadersInit
  });

//Функция updateUserApi предназначена для обновления информации о пользователе через API.
export const updateUserApi = (user: Partial<TRegisterData>) =>
  fetchWithRefresh<TUserResponse>(`${URL}/auth/user`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      authorization: getCookie('accessToken')
    } as HeadersInit,
    body: JSON.stringify(user)
  });

//Функция logoutApi предназначена для выполнения операции выхода пользователя из системы через API.
export const logoutApi = () =>
  fetch(`${URL}/auth/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({
      token: localStorage.getItem('refreshToken')
    })
  }).then((res) => checkResponse<TServerResponse<{}>>(res));
