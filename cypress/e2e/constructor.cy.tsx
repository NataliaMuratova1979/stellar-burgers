describe('Тестирование конструктора', () => {
  beforeEach(() => {
    // Перехватываем запрос к API
    cy.intercept('GET', '/api/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );

    cy.intercept('GET', '/api/auth/user', { fixture: 'user.json' }).as(
      'getUser'
    );

    // Посещаем главную страницу
    cy.visit('/');

    // Ждем завершения запроса
    cy.wait('@getIngredients');
  });
  //КОД НИЖЕ РАБОТАЕТ, НЕ ТРОГАТЬ
  /* 
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
  }); */
  //КОД НИЖЕ РАБОТАЕТ, НЕ ТРОГАТЬ
  describe('Тестирование модального окна ингредиента', () => {
    beforeEach(() => {
      // Находим первый ингредиент и присваиваем алиас
      cy.get('li').first().as('firstIngredient');
    });

    const openModal = () => {
      // Кликаем по первому ингредиенту, чтобы открыть модальное окно
      cy.get('@firstIngredient').click();

      // Проверяем, что модальное окно открыто
      cy.get('[data-cy="modal"]')
        .should('be.visible')
        .then(() => {
          cy.log('Модальное окно успешно открыто');
        });
    };

    const closeModalByCloseButton = () => {
      // Кликаем по кнопке закрытия
      cy.get('[data-cy="close-button"]').click();

      // Проверяем, что модальное окно закрыто
      cy.get('[data-cy="modal"]')
        .should('not.exist')
        .then(() => {
          cy.log('Модальное окно успешно закрыто');
        });
    };

    const closeModalByOverlay = () => {
      // Кликаем по оверлею с использованием force
      cy.get('[data-cy="overlay"]').click({ force: true });

      // Проверяем, что модальное окно закрыто
      cy.get('[data-cy="modal"]')
        .should('not.exist')
        .then(() => {
          cy.log('Модальное окно успешно закрыто');
        });
    };

    it('Открытие модального окна при клике на ингредиент', () => {
      openModal();

      // Дополнительно проверяем, что заголовок модального окна содержит ожидаемый текст
      // Замените 'Название ингредиента' на актуальное название
      // cy.get('.modal .title').should('contain', 'Название ингредиента');
    });

    it('Закрытие модального окна по клику на крестик', () => {
      openModal();
      closeModalByCloseButton();
    });

    it('Закрытие модального окна по клику на оверлей', () => {
      openModal();
      closeModalByOverlay();
    });
  });

  //КОД НИЖЕ
});
