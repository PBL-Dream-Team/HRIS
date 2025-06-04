describe('Signin Page with admin credentials', () => {
  it('Signs in as admin and navigates to Letters section', () => {
    cy.visit('/signin/employee');
    cy.get('input[id="email"]').should('not.be.disabled').type('setiabudi@gmail.com');
    cy.get('input[id="password"]').should('not.be.disabled').type('admin123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/redirect');
    cy.wait(10000);
    cy.url().should('include', '/dashboard');

    cy.contains('button', 'Letters').should('be.visible').click();
    cy.url().should('include', '/letters');
  });
});
