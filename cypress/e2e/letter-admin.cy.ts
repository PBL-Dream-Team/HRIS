describe('Accessing the letter page with admin credentials', () => {
  it('Signs in as admin, navigates to Letters section, and adds Letter Type', () => {
    // Sign in and navigate to Letters
    cy.visit('/signin');
    cy.get('input[id="email"]').should('not.be.disabled').type('admin@gmail.com');
    cy.get('input[id="password"]').should('not.be.disabled').type('admin123');
    cy.get('button[type="submit"]').click();
    cy.url({ timeout: 60000 }).should('include', '/redirect');
    cy.url({ timeout: 60000 }).should('include', '/dashboard');

    cy.contains('button', 'Letters').should('be.visible').click();
    cy.url({ timeout: 60000 }).should('include', '/letters');

    // ADD - Click Add Letter Type button
    cy.get('button[aria-haspopup="dialog"]').contains('Add Letter Type').click();
    cy.get('#letterTypeName').should('be.visible').type('Surat Bolos');
    cy.get('#letterTypeContent').click().type('Surat Peringatan Pelanggaran Peraturan Kerja');
    cy.get('button[type="submit"].w-24').click();
    cy.contains('Letter type created successfully!', { timeout: 10000 }).should('be.visible');

    // EDIT - Letter Type Overview button
    cy.get('button[aria-haspopup="dialog"]').contains('Letter Type Overview').click();
    cy.contains('tr', 'Surat Bolos').within(() => {
      cy.get('button[class*="hover:bg-yellow-500"]').click();
    });
    cy.get('#letterTypeContent').click().clear().type('Surat Peringatan Pelanggaran Peraturan Kerja diedit');
    cy.get('button').contains('Update').click();
    cy.contains('Letter type updated successfully!', { timeout: 10000 }).should('be.visible');

    // DELETE - Letter Type if it exists
    cy.contains('tr', 'Surat Bolos').within(() => {
      cy.get('button[class*="hover:bg-red-600"]').click();
    });
    cy.get('button').contains('Delete').click();
    cy.contains('Letter type deleted successfully!', { timeout: 10000 }).should('be.visible');
    cy.contains('Letter Types').should('be.visible');
    cy.get('button[class*="absolute right-4 top-4"]').click();

  });
});
