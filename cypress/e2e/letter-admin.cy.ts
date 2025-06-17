describe('Accessing the letter page with admin credentials', () => {
  it('Signs in as admin, navigates to Letters section, and adds Letter Type', () => {
    // Sign in and navigate to Letters
    cy.visit('/signin');
    cy.get('input[id="email"]')
      .should('not.be.disabled')
      .type('admin@gmail.com');
    cy.get('input[id="password"]').should('not.be.disabled').type('admin123');
    cy.get('button[type="submit"]').click();
    cy.url({ timeout: 60000 }).should('include', '/redirect');
    cy.url({ timeout: 60000 }).should('include', '/dashboard');

    // Navigate to Letters section
    cy.contains('button', 'Letters', { timeout: 10000 })
      .should('be.visible')
      .click();
    cy.url({ timeout: 60000 }).should('include', '/letters');
    cy.log('Successfully navigated to Letters page');

    // ADD - Click Add Letter Type button with more flexible selector
    cy.contains('button', 'Add Letter Type', { timeout: 10000 })
      .should('be.visible')
      .click();

    // Verify the modal is open
    cy.get('#letterTypeName', { timeout: 10000 })
      .should('be.visible')
      .type('Surat Bolos');
    cy.get('#letterTypeContent')
      .click()
      .type('Surat Peringatan Pelanggaran Peraturan Kerja');
    cy.contains('button', 'Submit').click();
    cy.contains('Letter type created successfully!', { timeout: 10000 }).should(
      'be.visible',
    );

    // EDIT - Letter Type Overview button
    cy.contains('button', 'Letter Type Overview', { timeout: 10000 })
      .should('be.visible')
      .click();

    // Find and edit the letter type
    cy.contains('tr', 'Surat Bolos').within(() => {
      cy.get('button[class*="hover:bg-yellow-500"]').click();
    });

    cy.get('#letterTypeContent', { timeout: 10000 })
      .click()
      .clear()
      .type('Surat Peringatan Pelanggaran Peraturan Kerja diedit');
    cy.contains('button', 'Update').click();
    
    // DELETE - Letter Type
    cy.contains('tr', 'Surat Bolos').within(() => {
      cy.get('button[class*="hover:bg-red-600"]').click();
    });
    cy.get('button').contains('Delete').click();
    cy.contains('Letter Types').should('be.visible');

    // Close any remaining modals
    cy.get('body').then(($body) => {
      if ($body.find('button[class*="absolute right-4 top-4"]').length) {
        cy.get('button[class*="absolute right-4 top-4"]').click();
      }
    });
  });
});
