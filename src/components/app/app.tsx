import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation
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

/* импортируем модалки */
// import { Modal } from '../modal';
// import { OrderInfo } from '../order-info';
// import { IngredientDetails } from '../ingredient-details';

import {
  AppHeader,
  IngredientDetails,
  Modal,
  FeedInfo,
  OrderInfo,
  OrdersList
} from '@components';
import '../../index.css';
import styles from './app.module.css';
import { fetchIngredients } from '../../services/ingredientsSlice';
import { RootState, useDispatch, useSelector } from '../../services/store';
import { Preloader } from '@ui';

const App: React.FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  // Определяем фоновое местоположение для модалей
  const backgroundLocation = location.state?.backgroundLocation;

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
  const handleCloseModal = () => {
    console.log('Closing modal');
    setIsModalOpen(false);
  };

  // Эффект для загрузки ингредиентов при монтировании компонента
  useEffect(() => {
    console.log('Fetching ingredients');
    dispatch(fetchIngredients());
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
          <Routes location={backgroundLocation || location}>
            <Route path='/' element={<ConstructorPage />} />
            <Route path='/feed' element={<Feed />} />
            <Route path='/feedinfo' element={<FeedInfo />} />
            <Route path='/feed/:number' element={<OrderInfo />} />

            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/forgot-password' element={<ForgotPassword />} />
            <Route path='/reset-password' element={<ResetPassword />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/profile/orders' element={<ProfileOrders />} />
            <Route path='/*' element={<NotFound404 />} />
            <Route path='/ingredients/:id' element={<IngredientDetails />} />
          </Routes>

          {/* Если есть фоновое местоположение, отображаем модальное окно с деталями ингредиента */}
          {backgroundLocation && (
            <Routes>
              <Route
                path='/ingredients/:id'
                element={
                  <Modal title='Детали ингридиента' onClose={handleCloseModal}>
                    <IngredientDetails />
                  </Modal>
                }
              />
            </Routes>
          )}
        </>
      ) : (
        // Если нет ингредиентов, отображаем соответствующее сообщение
        <p>Нет ингредиентов</p>
      )}
    </div>
  );
};

export default App;
