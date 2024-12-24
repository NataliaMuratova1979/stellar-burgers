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
      // Находим первый ингредиент, но не кликаем по нему
      cy.get('li').first().as('firstIngredient'); // Присваиваем алиас для удобства
    });

    it('Открытие модального окна при клике на ингредиент', () => {
      // Кликаем по первому ингредиенту
      cy.get('@firstIngredient').click();

      // Проверяем, что модальное окно открыто
      cy.get('[data-cy="modal"]')
        .should('be.visible')
        .then(() => {
          cy.log('Модальное окно успешно открыто');
        });

      // Дополнительно проверяем, что заголовок модального окна содержит ожидаемый текст
      /*
      cy.get('.modal .title')
        .should('exist')
        .then(() => {
          cy.log('Заголовок модального окна существует');
        }); */
      // Замените 'Название ингредиента' на актуальное название, если нужно
      // cy.get('.modal .title').should('contain', 'Название ингредиента');
    });

    it('Закрытие модального окна по клику на крестик', () => {
      // Кликаем по первому ингредиенту, чтобы открыть модальное окно
      cy.get('@firstIngredient').click();

      // Проверяем, что модальное окно открыто перед закрытием
      cy.get('[data-cy="modal"]')
        .should('be.visible')
        .then(() => {
          cy.log('Модальное окно успешно открыто перед закрытием');
        });

      // Кликаем по кнопке закрытия
      cy.get('[data-cy="close-button"]').click();

      // Проверяем, что модальное окно закрыто
      cy.get('[data-cy="modal"]')
        .should('not.exist')
        .then(() => {
          cy.log('Модальное окно успешно закрыто');
        });
    });

    it('Закрытие модального окна по клику на оверлей', () => {
      // Кликаем по первому ингредиенту, чтобы открыть модальное окно
      cy.get('@firstIngredient').click();

      // Проверяем, что модальное окно открыто перед закрытием
      cy.get('[data-cy="modal"]')
        .should('be.visible')
        .then(() => {
          cy.log('Модальное окно успешно открыто перед закрытием');
        });

      // Кликаем по оверлею с использованием force
      cy.get('[data-cy="overlay"]').click({ force: true });

      // Проверяем, что модальное окно закрыто
      cy.get('[data-cy="modal"]')
        .should('not.exist')
        .then(() => {
          cy.log('Модальное окно успешно закрыто');
        });
    });
  });
  //КОД НИЖЕ РАБОТАЕТ, НЕ ТРОГАТЬ

  describe('Тестирование авторизации с моковыми токенами', () => {
    beforeEach(() => {
      // Мокируем запрос на аутентификацию
      cy.intercept('POST', '/api/login', {
        statusCode: 200,
        body: {
          accessToken: mockAccessToken,
          refreshToken: mockRefreshToken
        }
      }).as('loginRequest');

      // Мокируем защищенный ресурс, который требует авторизации
      cy.intercept('GET', '/api/protected', {
        statusCode: 200,
        body: {
          message: 'Доступ к защищенному ресурсу разрешен'
        }
      }).as('protectedResource');
    });

    it('Должен успешно пройти аутентификацию и получить доступ к защищенному ресурсу', () => {
      // Переходим на страницу входа
      cy.visit('/login');

      // Заполняем форму входа
      cy.get('[data-cy="username"]').type('john.doe');
      cy.get('[data-cy="password"]').type('password123');
      cy.get('[data-cy="submit"]').click();

      // Ждем ответа на запрос входа
      cy.wait('@loginRequest').its('response.statusCode').should('eq', 200);

      // Теперь мы можем получить доступ к защищенному ресурсу
      cy.request({
        method: 'GET',
        url: '/api/protected',
        headers: {
          Authorization: mockAccessToken
        }
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.message).to.eq(
          'Доступ к защищенному ресурсу разрешен'
        );
      });
    });
  });
});
