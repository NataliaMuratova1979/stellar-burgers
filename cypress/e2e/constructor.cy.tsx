describe('Тестирование конструктора', () => {
  beforeEach(() => {
    // Перехватываем запрос к API
    cy.intercept('GET', '/api/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );

    // Посещаем главную страницу
    cy.visit('/');

    // Ждем завершения запроса
    cy.wait('@getIngredients');
  });

  describe('Протестировано добавление ингредиента из списка в конструктор', () => {
    // Универсальная функция для тестирования добавления ингредиента
    function testIngredient(chooseText, ingredientName) {
      it(`Div должен отображать сообщение "${chooseText}"`, () => {
        // Проверяем, что div с текстом chooseText существует и виден
        cy.get('div')
          .contains(chooseText) // Используем аргумент chooseText
          .should('be.visible'); // Проверяем, что он видим
      });

      it(`добавление ${ingredientName} в конструктор`, () => {
        // Находим ингредиент и добавляем его
        cy.contains(ingredientName) // Используем аргумент ingredientName
          .parents('li')
          .find('button') // Ищем кнопку с текстом "Добавить"
          .click();

        // Проверяем, что div с текстом chooseText больше не существует
        cy.get('div')
          .contains(chooseText) // Ищем div с текстом chooseText
          .should('not.exist'); // Проверяем, что он не существует
      });
    }

    // Вызываем функцию для булки
    testIngredient('Выберите булки', 'Краторная булка N-200i');

    // Вызываем функцию для начинки
    testIngredient('Выберите начинку', 'Биокотлета из марсианской Магнолии');

    // Вы можете добавлять дополнительные ингредиенты аналогичным образом
    testIngredient('Выберите начинку', 'Соус Spicy-X');
  });
});
