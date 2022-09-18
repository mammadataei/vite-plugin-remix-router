export {}

it('should work', () => {
  cy.visit('/')
  cy.findByRole('heading', { name: 'Home' }).should('exist')
})
