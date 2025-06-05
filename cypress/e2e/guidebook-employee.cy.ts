describe('Accessing the Guidebook page with employee credentials', () => {
  it('Signs in as employee and navigates to Guidebook section', () => {
    cy.visit('/signin');
    cy.get('input[id="email"]').should('not.be.disabled').type('setiabudi@gmail.com');
    cy.get('input[id="password"]').should('not.be.disabled').type('admin123');
    cy.get('button[type="submit"]').click();
    cy.url({ timeout: 60000 }).should('include', '/redirect');
    cy.url({ timeout: 60000 }).should('include', '/dashboard');

    cy.contains('button', 'Guidebook').should('be.visible').click();
    cy.url({ timeout: 60000 }).should('include', '/guidebook');
  });
});
