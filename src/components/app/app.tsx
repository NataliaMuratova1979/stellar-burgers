import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
  useParams
} from 'react-router-dom';

import { useEffect, useState } from 'react';

import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';

import { clearTokens } from '../../utils/tokens';

import {
  AppHeader,
  IngredientDetails,
  Modal,
  FeedInfo,
  OrderInfo,
  OrdersList,
  OrderCard
} from '@components';
import '../../index.css';
import styles from './app.module.css';
import { fetchIngredients } from '../../services/ingredientsSlice';
import { RootState, useDispatch, useSelector } from '../../services/store';
import { Preloader } from '@ui';

import { checkUserAuth } from '../../services/userSlice';

import { OnlyAuth, OnlyUnAuth } from '../../services/protected-route';

const App: React.FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  console.log('location', location);
  const navigate = useNavigate();

  // Определяем фоновое местоположение для модалей
  //const backgroundLocation = location.state?.backgroundLocation;
  const state = location.state as { background?: Location };

  // Получаем состояние ингредиентов из Redux
  const { ingredients, loading, error } = useSelector(
    (state: RootState) => state.ingredients
  );

  // Локальное состояние для управления открытием/закрытием модального окна
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Функция для открытия модального окна
  const handleOpenModal = () => {
    console.log('Opening modal');
    setIsModalOpen(true);
  };

  // Функция для закрытия модального окна
  //const handleCloseModal = () => {
  // console.log('Closing modal');
  // setIsModalOpen(false);
  ///  };

  // Эффект для загрузки ингредиентов при монтировании компонента
  useEffect(() => {
    console.log('Fetching ingredients');
    dispatch(fetchIngredients());
  }, [dispatch]);

  // Диспетчеризация проверки аутентификации при монтировании компонента
  useEffect(() => {
    dispatch(checkUserAuth());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      {loading ? (
        // Отображаем прелоадер, если данные загружаются
        <Preloader />
      ) : error ? (
        // Отображаем ошибку, если произошла ошибка при загрузке данных
        <p>Ошибка: {error}</p>
      ) : ingredients.length > 0 ? (
        <>
          <Routes location={state?.background || location}>
            <Route path='/' element={<ConstructorPage />} />
            <Route path='/feed' element={<Feed />} />
            <Route path='/feedinfo' element={<FeedInfo />} />
            <Route path='/feed/:number' element={<OrderInfo />} />
            <Route
              path='/profile'
              element={<OnlyAuth component={<Profile />} />}
            />
            <Route
              path='/profile/orders'
              element={<OnlyAuth component={<ProfileOrders />} />}
            />
            <Route
              path='/profile/orders/:number'
              element={<OnlyAuth component={<OrderInfo />} />}
            />
            <Route
              path='/login'
              element={<OnlyUnAuth component={<Login />} />}
            />
            <Route
              path='/register'
              element={<OnlyUnAuth component={<Register />} />}
            />
            <Route
              path='/reset-password'
              element={<OnlyUnAuth component={<ForgotPassword />} />}
            />
            <Route
              path='/forgot-password'
              element={<OnlyUnAuth component={<ResetPassword />} />}
            />
            <Route path='/*' element={<NotFound404 />} />
            <Route path='/ingredients/:id' element={<IngredientDetails />} />
          </Routes>
          {/* Если есть фоновое местоположение, отображаем модальное окно с деталями ингредиента */}
          {state?.background && (
            <Routes>
              <Route
                path='/ingredients/:id'
                element={
                  <Modal
                    title='Детали ингредиента'
                    onClose={() => navigate(-1)}
                  >
                    <IngredientDetails />
                  </Modal>
                }
              />
            </Routes>
          )}
          {state?.background && (
            <Routes>
              <Route
                path='feed/:number'
                element={
                  <Modal title='Детали заказа' onClose={() => navigate(-1)}>
                    <OrderInfo />
                  </Modal>
                }
              />
            </Routes>
          )}
          {state?.background && (
            <Routes>
              <Route
                path='profile/orders/:number'
                element={
                  <Modal title='Детали заказа' onClose={() => navigate(-1)}>
                    <OrderInfo />
                  </Modal>
                }
              />
            </Routes>
          )}
        </>
      ) : (
        <p>No ingredients available</p>
      )}
    </div>
  );
};

export default App;
