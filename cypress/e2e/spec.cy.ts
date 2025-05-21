describe('Signup Page', () => {
  it('Visits the Signup Page', () => {
    cy.visit('/signup');
  });
});

describe('Signin Page with admin credentials', () => {
  it('Signs in as admin', () => {
    cy.visit('/signin');
    cy.get('input[id="input"]').type('admin@gmail.com');
    cy.get('input[id="password"]').type('admin123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/redirect');
  });
});



describe('Signin Page with employee credentials', () => {
  it('Signs in as employee', () => {
    cy.visit('/signin/employee');
    cy.get('input[id="input"]').type('setiabudi@gmail.com');
    cy.get('input[id="password"]').type('admin123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/redirect');
  });
});
