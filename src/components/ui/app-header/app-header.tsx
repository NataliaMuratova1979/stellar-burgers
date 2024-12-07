import React, { FC, useEffect } from 'react';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';
import { Link, useLocation } from 'react-router-dom';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => {
  const location = useLocation();

  // Логируем информацию о рендере и текущем пути
  useEffect(() => {
    console.log('AppHeaderUI rendered');
    console.log('Current location:', location.pathname);
    console.log('User name:', userName);
  }, [location.pathname, userName]); // Добавляем зависимости для логирования изменений

  const handleLinkClick = (link: string) => {
    console.log('Navigating to: ${link}');
  };

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <>
            <BurgerIcon type={'primary'} />
            <Link
              to='/'
              onClick={() => handleLinkClick('/')}
              className={
                location.pathname === '/' ? styles.link_active : styles.link
              }
            >
              <p className='text text_type_main-default ml-2 mr-10'>
                Конструктор
              </p>
            </Link>
          </>
          <>
            <ListIcon type={'primary'} />
            <Link
              to='/feed'
              onClick={() => handleLinkClick('/')}
              className={
                location.pathname.includes('feed')
                  ? styles.link_active
                  : styles.link
              }
            >
              <p className='text text_type_main-default ml-2'>Лента заказов</p>
            </Link>
          </>
        </div>
        <div className={styles.logo}>
          <Logo className='' />
        </div>
        <div className={styles.link_position_last}>
          <ProfileIcon type={'primary'} />
          <Link
            to='/profile'
            onClick={() => handleLinkClick('/')}
            className={
              location.pathname.includes('profile')
                ? styles.link_active
                : styles.link
            }
          >
            <p className='text text_type_main-default ml-2'>
              {userName || 'Личный кабинет'}
            </p>
          </Link>
        </div>
      </nav>
    </header>
  );
};
/**
 * import React, { FC } from 'react';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';
import { Link, useLocation } from 'react-router-dom';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => {
  const location = useLocation();
  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <>
            <BurgerIcon type={'primary'} />
            <Link
              to='/'
              className={
                location.pathname === '/' ? styles.link_active : styles.link
              }
            >
              <p className='text text_type_main-default ml-2 mr-10'>
                Конструктор
              </p>
            </Link>
          </>
          <>
            <ListIcon type={'primary'} />
            <Link
              to='/feed'
              className={
                location.pathname.includes('feed')
                  ? styles.link_active
                  : styles.link
              }
            >
              <p className='text text_type_main-default ml-2'>Лента заказов</p>
            </Link>
          </>
        </div>
        <div className={styles.logo}>
          <Logo className='' />
        </div>
        <div className={styles.link_position_last}>
          <ProfileIcon type={'primary'} />
          <Link
            to='/profile'
            className={
              location.pathname.includes('profile')
                ? styles.link_active
                : styles.link
            }
          >
            <p className='text text_type_main-default ml-2'>
              {userName || 'Личный кабинет'}
            </p>
          </Link>
        </div>
      </nav>
    </header>
  );
};
 */
