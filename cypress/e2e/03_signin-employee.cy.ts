describe('Signin Page with employee credentials', () => {
  it('Signs in as employee', () => {
    cy.visit('/signin/employee');
    cy.get('input[id="email"]').type('setiabudi@gmail.com');
    cy.get('input[id="password"]').type('admin123');
    cy.get('button[type="submit"]').click();
    cy.url({ timeout: 60000 }).should('include', '/redirect');
  });
});
