import { expect } from '@jest/globals';


describe('Тестирование функции toEqual', () => {
  it('should check if two objects are equal', () => {
    const obj1 = { name: 'Alice', age: 25 };
    const obj2 = { name: 'Alice', age: 25 };

    expect(obj1).toEqual(obj2);
  });

  it('should check if two arrays are equal', () => {
    const arr1 = [1, 2, 3];
    const arr2 = [1, 2, 3];

    expect(arr1).toEqual(arr2);
  });

  it('should check if two different objects are not equal', () => {
    const obj1 = { name: 'Alice', age: 25 };
    const obj2 = { name: 'Bob', age: 30 };

    expect(obj1).not.toEqual(obj2);
  });
});
