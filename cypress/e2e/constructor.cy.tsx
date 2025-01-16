const modalSelector = '[data-cy="modal"]'; // Замена на константу
const closeButtonSelector = '[data-cy="close-button"]'; // Замена на константу
const overlaySelector = '[data-cy="overlay"]'; // Замена на константу
const orderButtonSelector = '[data-cy="order-button"]'; // Замена на константу
const orderNumberSelector = '[data-cy="order-number"]'; // Замена на константу

describe('Тестирование конструктора', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );

    cy.intercept('GET', '/api/auth/user', { fixture: 'user.json' }).as(
      'getUser'
    );

    cy.window().then((win) => {
      win.localStorage.setItem('refreshToken', 'fakeRefreshToken'); // Устанавливаем фейковый refreshToken
    });
    cy.setCookie('accessToken', 'fakeAccessToken');

    cy.visit('/');

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

    testIngredient('Выберите булки', 'Краторная булка N-200i');

    testIngredient('Выберите начинку', 'Биокотлета из марсианской Магнолии');

    testIngredient('Выберите начинку', 'Соус Spicy-X');
  });

  describe('Тестирование модального окна ингредиента', () => {
    beforeEach(() => {
      cy.get('li').first().as('firstIngredient');
    });

    const openModal = () => {
      cy.get('@firstIngredient').click();

      cy.get(modalSelector)
        .should('be.visible')
        .then(() => {
          cy.log('Модальное окно успешно открыто');
        });
    };

    const closeModalByCloseButton = () => {
      cy.get(closeButtonSelector).click();

      cy.get(modalSelector)
        .should('not.exist')
        .then(() => {
          cy.log('Модальное окно успешно закрыто');
        });
    };

    const closeModalByOverlay = () => {
      cy.get(overlaySelector).click({ force: true });

      cy.get(modalSelector)
        .should('not.exist')
        .then(() => {
          cy.log('Модальное окно успешно закрыто');
        });
    };

    it('Открытие модального окна при клике на ингредиент', () => {
      openModal();
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
  describe('Тестирование создания заказа', () => {
    it('Оформление заказа', () => {
      cy.intercept('POST', '/api/orders', { fixture: 'order.json' }).as(
        'postOrder'
      );

      // Проверка что модальное окно не активно
      //cy.get('[data-cy=modal]').should('not.exist');

      ['Булки', 'Начинки', 'Соусы'].forEach((category) => {
        cy.get('h3').contains(category).next('ul').contains('Добавить').click();
      });

      cy.get(orderButtonSelector).click();

      cy.wait('@postOrder').then((interception) => {
        const mockOrderData = interception.response.body; // Получаем данные из ответа

        cy.get(orderNumberSelector).should(
          'contain',
          mockOrderData.order.number
        );
      });

      cy.get(modalSelector).should('be.visible');

      cy.get(closeButtonSelector).click();

      // Проверяем, что модальное окно закрыто
      cy.get(modalSelector).should('not.exist');

      ['Выберите булки', 'Выберите начинку'].forEach((text) => {
        cy.contains(text).should('exist');
      });
    });
  });
});
