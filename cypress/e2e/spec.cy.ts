describe('Signup Page', () => {
  it('Visits the Signup Page', () => {
    cy.visit(`${Cypress.env('BASE_URL')}/signup`);
  });
});

describe('Signin Page', () => {
  it('Visits the Signin Page', () => {
    cy.visit(`${Cypress.env('BASE_URL')}/signin`);
  });
});
