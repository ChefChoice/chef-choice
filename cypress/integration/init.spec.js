/*

  This test is designed to ensure the server is responding properly and
  is mostly a temporary measure so Cypress doesn't throw errors since there
  are currently no actual tests for the application.

*/

describe('Ensure Response', () => 
{
  it('can visit url', () => 
  {
    cy.visit('/');
  })
})
