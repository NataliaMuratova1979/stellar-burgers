import burgerReducer, {
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  clearConstructor,
  initialState
} from '../src/services/burgerSlice'; 
import { TConstructorIngredient } from '../src/utils/types';

import { describe, it, expect } from '@jest/globals';

const ingredient1: TConstructorIngredient = {
  _id: '1',
  id: '1',
  name: 'Помидор',
  type: 'ingredient',
  proteins: 1,
  fat: 0,
  carbohydrates: 4,
  calories: 20,
  price: 10,
  image: '',
  image_large: '',
  image_mobile: ''
};

const ingredient2: TConstructorIngredient = {
  _id: '2',
  id: '2',
  name: 'Лук',
  type: 'ingredient',
  proteins: 1,
  fat: 0,
  carbohydrates: 4,
  calories: 20,
  price: 10,
  image: '',
  image_large: '',
  image_mobile: ''
};

describe('Тестирование burgerSlice reducer', () => {

  it('должен добавлять ингредиент', () => {
    // Объявляем и инициализируем newState
    const newState = burgerReducer(initialState, addIngredient(ingredient1));

    expect(newState.constructorItems.ingredients).toContain(ingredient1);
  });

  it('должен удалять ингредиент', () => {

    // Добавляем ингредиенты в начальное состояние
    let newState = burgerReducer(initialState, addIngredient(ingredient1));
    newState = burgerReducer(newState, addIngredient(ingredient2));

    // Удаляем ингредиент
    newState = burgerReducer(newState, removeIngredient('1'));

    expect(newState.constructorItems.ingredients).not.toContain(ingredient1);
    expect(newState.constructorItems.ingredients).toContain(ingredient2);
  });

  it('должен менять порядок ингредиентов вверх', () => {
    // Добавляем ингредиенты в начальное состояние
    let newState = burgerReducer(initialState, addIngredient(ingredient1));
    newState = burgerReducer(newState, addIngredient(ingredient2));

    // Меняем порядок ингредиентов
    newState = burgerReducer(newState, moveIngredientUp('2'));

    expect(newState.constructorItems.ingredients[0]).toEqual(ingredient2);
    expect(newState.constructorItems.ingredients[1]).toEqual(ingredient1);
  });

  it('должен менять порядок ингредиентов вниз', () => {
    // Добавляем ингредиенты в начальное состояние
    let newState = burgerReducer(initialState, addIngredient(ingredient1));
    newState = burgerReducer(newState, addIngredient(ingredient2));

    // Меняем порядок ингредиентов
    newState = burgerReducer(newState, moveIngredientDown('1'));

    expect(newState.constructorItems.ingredients[0]).toEqual(ingredient2);
    expect(newState.constructorItems.ingredients[1]).toEqual(ingredient1);
  });

  it('должен очищать конструктор', () => {
    // Добавляем ингредиент в начальное состояние
    let newState = burgerReducer(initialState, addIngredient(ingredient1));

    // Очищаем конструктор
    newState = burgerReducer(newState, clearConstructor());

    expect(newState.constructorItems.bun).toBeNull();
    expect(newState.constructorItems.ingredients).toHaveLength(0);
  });
});
