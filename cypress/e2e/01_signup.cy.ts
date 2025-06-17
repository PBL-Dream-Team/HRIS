// describe('Signup Page', () => {
//   it('Visits the Signup Page', () => {
//     cy.visit('/signup');
//     cy.get('input[id="name"]').type('Dream Team Company');
//     cy.get('input[id="first_name"]').type('Muhammad');
//     cy.get('input[id="last_name"]').type('Haris');
//     cy.get('input[id="email"]').type('hrisdreamteam@gmail.com');
//     cy.get('input[id="phone"]').type('081234567890');
//     cy.get('input[id="password"]').type('#Admin123');
//     cy.get('input[id="confirmPassword"]').type('#Admin123');
//     cy.get('button[role="checkbox"]#terms').click();
//     cy.get('button[type="submit"]').click();
//     cy.url({ timeout: 60000 }).should('include', '/signin');
//   });
// });