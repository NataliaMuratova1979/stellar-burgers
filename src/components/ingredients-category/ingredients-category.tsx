import { forwardRef, useMemo } from 'react'; // Импортируем необходимые хуки и функции из React
import { TIngredientsCategoryProps } from './type'; // Импортируем типы пропсов для компонента
import { TIngredient } from '@utils-types'; // Импортируем тип для ингредиентов
import { IngredientsCategoryUI } from '../ui/ingredients-category'; // Импортируем UI компонент для отображения категории ингредиентов

import { useSelector } from 'react-redux'; // Импортируем useSelector для доступа к состоянию Redux

import { selectBurgerConstructor } from '../../services/burgerSlice'; // Импортируем селекторы для получения булки и ингредиентов

// Создаем компонент IngredientsCategory с использованием forwardRef для передачи рефа
export const IngredientsCategory = forwardRef<
  HTMLUListElement,
  TIngredientsCategoryProps // Указываем типы для рефа и пропсов
>(({ title, titleRef, ingredients }, ref) => {
  // Используем useSelector для получения burgerConstructor из Redux состояния
  const { bun, ingredients: constructorIngredients } = useSelector(
    selectBurgerConstructor
  );

  // Используем useMemo для оптимизации вычисления счетчиков ингредиентов
  const ingredientsCounters = useMemo(() => {
    const counters: { [key: string]: number } = {}; // Инициализируем объект для хранения счетчиков

    // Логируем начальные значения
    console.log('вот bun:', bun);
    console.log('вот ingredients:', constructorIngredients);

    // Проходим по каждому ингредиенту и считаем их количество
    constructorIngredients.forEach((ingredientId: string) => {
      if (!counters[ingredientId]) counters[ingredientId] = 0; // Если ингредиент еще не был добавлен в счетчик, инициализируем его
      counters[ingredientId]++; // Увеличиваем счетчик для данного ингредиента
    });

    // Логируем текущие счетчики ингредиентов
    console.log('Current ingredient counters:', counters);

    // Если есть булка, устанавливаем его количество в 2 (для верхней и нижней части бургера)
    if (bun) counters[bun] = 2;

    // Логируем окончательные счетчики ингредиентов
    console.log('Final ingredient counters with bun:', counters);

    return counters; // Возвращаем объект с количеством ингредиентов
  }, [bun, constructorIngredients]); // Зависимости от bun и constructorIngredients

  // Возвращаем UI компонент с переданными пропсами и рефом
  return (
    <IngredientsCategoryUI
      title={title} // Заголовок категории
      titleRef={titleRef} // Реф для заголовка
      ingredients={ingredients} // Список ингредиентов
      ingredientsCounters={ingredientsCounters} // Счетчики ингредиентов
      ref={ref} // Реф для списка ингредиентов
    />
  );
});
