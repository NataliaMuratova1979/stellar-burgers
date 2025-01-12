import reducer, { fetchIngredients } from '../src/services/ingredientsSlice';
import { TIngredient } from '../src/utils/types';

import { describe, it, expect } from '@jest/globals';

describe('Тестирование ingredientsSlice', () => {
  const initialState = {
    ingredients: [],
    loading: false,
    error: null
  };

  it('должен обрабатывать fetchIngredients.pending', () => {
    const action = { type: fetchIngredients.pending.type };
    const state = reducer(initialState, action);

    expect(state.loading).toBe(true);
    expect(state.error).toBe(null);
  });

  it('должен обрабатывать fetchIngredients.fulfilled', () => {
    const mockIngredients: TIngredient[] = [
      {
        _id: '1',
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
      }
    ];

    const action = {
      type: fetchIngredients.fulfilled.type,
      payload: mockIngredients
    };
    const state = reducer(initialState, action);

    expect(state.loading).toBe(false);
    expect(state.ingredients).toEqual(mockIngredients);
  });

  it('должен обрабатывать fetchIngredients.rejected', () => {
    const errorMessage = 'Не удалось получить ингредиенты';
    const action = {
      type: fetchIngredients.rejected.type,
      error: { message: errorMessage }
    };
    const state = reducer(initialState, action);

    expect(state.loading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });
});
