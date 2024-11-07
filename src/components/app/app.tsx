import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation
} from 'react-router-dom';

import { useState } from 'react';

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
//import { Modal } from '../modal';
//import { OrderInfo } from '../order-info';
//import { IngredientDetails } from '../ingredient-details';

import {
  AppHeader,
  IngredientDetails,
  Modal,
  FeedInfo,
  OrderInfo
} from '@components';
import '../../index.css';
import styles from './app.module.css';

const App: React.FC = () => {
  const location = useLocation();
  const backgroundLocation = location.state?.backgroundLocation;

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={backgroundLocation || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<FeedInfo />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/profile/orders' element={<ProfileOrders />} />
        <Route path='/*' element={<NotFound404 />} />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
      </Routes>

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
    </div>
  );
};

export default App;

/*
   
   <Route path="/feed/:number" element={
    <Modal title="Информация о заказе" onClose={closeModal}>
      <OrderInfo />
    </Modal>
  } />

по роуту /feed/:number расположите компонент Modal с компонентом OrderInfo;
по роуту /ingredients/:id расположите компонент Modal с компонентом IngredientDetails;
по защищённому роуту /profile/orders/:number расположите компонент Modal с компонентом OrderInfo */

/* _______________ПРИМЕР________________
import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import Gallery from "./components/gallery";
import ImageView from "./components/image-view";
import Modal from "./modal";
function App() {
  const location = useLocation();

  const backgroundLocation = location.state?.backgroundLocation;
  return (
    <>
      <Routes location={backgroundLocation || location}>
        <Route path="/" element={<Gallery />} />
        <Route path="/img/:id" element={<ImageView />} />
      </Routes>

      {backgroundLocation && (
        <Routes>
          <Route
            path="/img/:id"
            element={
              <Modal>
                <ImageView />
              </Modal>
            }
          />
        </Routes>
      )}
    </>
  );
}

export default App;
*/
