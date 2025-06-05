describe('Accessing the Absence page with employee credentials', () => {
  it('Signs in as employee and navigates to Absence section', () => {
    cy.visit('/signin/employee');
    cy.get('input[id="email"]').should('not.be.disabled').type('setiabudi@gmail.com');
    cy.get('input[id="password"]').should('not.be.disabled').type('admin123');
    cy.get('button[type="submit"]').click();
    cy.url({ timeout: 60000 }).should('include', '/redirect');
    cy.url({ timeout: 60000 }).should('include', '/dashboard');

    cy.contains('button', 'Absence').should('be.visible').click();
    cy.url({ timeout: 60000 }).should('include', '/absence');
  });
});
