describe('Letter Feature', () => {
  beforeEach(() => {
    cy.visit('/signin');
    cy.get('input[id="input"]').type('admin@gmail.com');
    cy.get('input[id="password"]').type('admin123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/redirect');
  });

  it('Opens Add Letter dialog and submits form', () => {
    cy.visit('/letter');

    cy.contains('Add Letter').click();
    cy.get('[role="dialog"]').should('exist');

    cy.get('[role="dialog"] input[id="title"]').type('Surat Pengantar');
    cy.get('[role="dialog"] textarea[id="description"]').type(
      'Surat ini untuk keperluan administrasi.',
    );
    cy.get('[role="dialog"] select[id="letter_type"]').select('Pengantar');

    cy.get('[role="dialog"] button[type="submit"]').click();
    cy.contains('Letter added successfully').should('exist');
    cy.get('[role="dialog"]').should('not.exist');
  });

  it('Opens Edit Letter dialog and submits form', () => {
    cy.visit('/letter');

    cy.get('[data-cy=edit-letter-button]').first().click();
    cy.get('[role="dialog"]').should('exist');

    cy.get('[role="dialog"] input[id="title"]').clear().type('Surat Dinas');
    cy.get('[role="dialog"] textarea[id="description"]')
      .clear()
      .type('Surat ini untuk keperluan dinas.');
    cy.get('[role="dialog"] select[id="letter_type"]').select('Dinas');

    cy.get('[role="dialog"] button[type="submit"]').click();
    cy.contains('Letter updated successfully').should('exist');
    cy.get('[role="dialog"]').should('not.exist');
  });

  it('Deletes a letter', () => {
    cy.visit('/letter');

    cy.get('[data-cy=delete-letter-button]').first().click();
    cy.get('[role="dialog"]').should('exist');
    cy.get('[role="dialog"] button[type="submit"]').click();

    cy.contains('Letter deleted successfully').should('exist');
    cy.get('[role="dialog"]').should('not.exist');
  });

  it('Displays letter details', () => {
    cy.visit('/letter');

    cy.get('[data-cy=letter-item]').first().click();
    cy.get('[data-cy=letter-details]').should('be.visible');
    cy.get('[data-cy=letter-title]').should('exist');
    cy.get('[data-cy=letter-description]').should('exist');
  });

  it('Opens Add Letter Type dialog and submits form', () => {
    cy.visit('/letter');
    cy.contains('Add Letter Type').click();

    cy.get('[role="dialog"]').should('exist');
    cy.get('[role="dialog"] input[id="type_name"]').type('Surat Cuti');
    cy.get('[role="dialog"] textarea[id="type_description"]').type(
      'Digunakan untuk cuti pegawai.',
    );

    cy.get('[role="dialog"] button[type="submit"]').click();
    cy.contains('Letter type added successfully').should('exist');
    cy.get('[role="dialog"]').should('not.exist');
  });
});
