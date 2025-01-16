import { describe, it, expect } from '@jest/globals'; // Импортируем функции для организации тестов из библиотеки Jest
import { rootReducer } from '../src/services/rootReducer'; // Импортируем корневой редюсер, который будем тестировать
import store from '../src/services/store'; // Импортируем хранилище (store), чтобы получить его состояние

describe('Тестирование rootReducer', () => {
  it('Проверка, что начальное состояние rootReducer соответствует состоянию хранилища', () => {
    const initialReducerState = rootReducer(undefined, {
      type: 'UNKNOWN_ACTION'
    });

    expect(store.getState()).toStrictEqual(initialReducerState);
  });
});
