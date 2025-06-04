describe('Signin Page with admin credentials', () => {
  it('Signs in as admin', () => {
    cy.visit('/signin');
    cy.get('input[id="email"]').type('admin@gmail.com');
    cy.get('input[id="password"]').type('admin123');
    cy.get('button[type="submit"]').click();
    cy.url({ timeout: 60000 }).should('include', '/redirect');
  });
});
