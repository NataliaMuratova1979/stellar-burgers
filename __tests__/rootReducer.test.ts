import { describe, it, expect } from '@jest/globals'; // Импортируем функции для организации тестов из библиотеки Jest
import { rootReducer } from '../src/services/rootReducer'; // Импортируем корневой редюсер, который будем тестировать
import store from '../src/services/store'; // Импортируем хранилище (store), чтобы получить его состояние

// Определяем группу тестов для rootReducer
describe('Тестирование rootReducer', () => {
  // Определяем отдельный тест
  // редюсер вызывается с неопределённым состоянием, он должен вернуть своё начальное состояние
  it('Проверка, что начальное состояние rootReducer соответствует состоянию хранилища', () => {
    // Вызываем редюсер с неопределенным состоянием и действием с типом 'UNKNOWN_ACTION'
    const initialReducerState = rootReducer(undefined, {
      type: 'UNKNOWN_ACTION' // Действие, которое не обрабатывается редюсером
    });

    // Сравниваем текущее состояние хранилища с начальным состоянием редюсера
    expect(store.getState()).toStrictEqual(initialReducerState);
  });
});
