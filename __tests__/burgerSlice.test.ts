import burgerReducer, {
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  clearConstructor
} from '../src/services/burgerSlice'; 
import { TConstructorIngredient } from '../src/utils/types';

import { describe, it, expect } from '@jest/globals';

describe('Тестирование burgerSlice reducer', () => {
  const initialState = {
    constructorItems: {
      bun: null,
      ingredients: []
    },
    orderRequest: false,
    orderModalData: null,
    orderError: null
  };

  it('должен добавлять ингредиент', () => {
    const ingredient: TConstructorIngredient = {
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

    // Объявляем и инициализируем newState
    const newState = burgerReducer(initialState, addIngredient(ingredient));

    expect(newState.constructorItems.ingredients).toContain(ingredient);
  });

  it('должен удалять ингредиент', () => {
    const ingredient1: TConstructorIngredient = {
      _id: '1', // Обязательно добавьте _id
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
      _id: '2', // Обязательно добавьте _id
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

    // Добавляем ингредиенты в начальное состояние
    let newState = burgerReducer(initialState, addIngredient(ingredient1));
    newState = burgerReducer(newState, addIngredient(ingredient2));

    // Удаляем ингредиент
    newState = burgerReducer(newState, removeIngredient('1'));

    expect(newState.constructorItems.ingredients).not.toContain(ingredient1);
    expect(newState.constructorItems.ingredients).toContain(ingredient2);
  });

  it('должен менять порядок ингредиентов вверх', () => {
    const ingredient1: TConstructorIngredient = {
      _id: '1', // Обязательно добавьте _id
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
      _id: '2', // Обязательно добавьте _id
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

    // Добавляем ингредиенты в начальное состояние
    let newState = burgerReducer(initialState, addIngredient(ingredient1));
    newState = burgerReducer(newState, addIngredient(ingredient2));

    // Меняем порядок ингредиентов
    newState = burgerReducer(newState, moveIngredientUp('2'));

    expect(newState.constructorItems.ingredients[0]).toEqual(ingredient2);
    expect(newState.constructorItems.ingredients[1]).toEqual(ingredient1);
  });

  it('должен менять порядок ингредиентов вниз', () => {
    const ingredient1: TConstructorIngredient = {
      _id: '1', // Обязательно добавьте _id
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
      _id: '2', // Обязательно добавьте _id
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

    // Добавляем ингредиенты в начальное состояние
    let newState = burgerReducer(initialState, addIngredient(ingredient1));
    newState = burgerReducer(newState, addIngredient(ingredient2));

    // Меняем порядок ингредиентов
    newState = burgerReducer(newState, moveIngredientDown('1'));

    expect(newState.constructorItems.ingredients[0]).toEqual(ingredient2);
    expect(newState.constructorItems.ingredients[1]).toEqual(ingredient1);
  });

  it('должен очищать конструктор', () => {
    const ingredient1: TConstructorIngredient = {
      _id: '1', // Обязательно добавьте _id
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

    // Добавляем ингредиент в начальное состояние
    let newState = burgerReducer(initialState, addIngredient(ingredient1));

    // Очищаем конструктор
    newState = burgerReducer(newState, clearConstructor());

    expect(newState.constructorItems.bun).toBeNull();
    expect(newState.constructorItems.ingredients).toHaveLength(0);
  });
});
