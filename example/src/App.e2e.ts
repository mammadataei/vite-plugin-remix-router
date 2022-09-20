export {}

it('should navigate through pages', () => {
  cy.visit('/')
  cy.findByRole('heading', { name: 'Login' }).should('exist')
  cy.location('pathname').should('equal', '/login')

  cy.findByPlaceholderText('Username').type('admin')
  cy.findByPlaceholderText('Password').type('secret')
  cy.findByRole('button', { name: 'Login' }).click()
  cy.findByRole('heading', { name: 'Posts' }).should('exist')
  cy.location('pathname').should('equal', '/posts')

  cy.findByText('Hello World').click()
  cy.location('pathname').should('equal', '/posts/hello-world')

  cy.findByText('back').click()
  cy.location('pathname').should('equal', '/posts')

  cy.get('nav').within(() => cy.findByText('Users').click())
  cy.findByRole('heading', { name: 'Users' }).should('exist')
  cy.location('pathname').should('equal', '/users')

  cy.findByText('John').click()
  cy.location('pathname').should('equal', '/users/john')

  cy.findByRole('link', { name: 'Profile' }).click()
  cy.location('pathname').should('equal', '/users/john/profile')

  cy.findByRole('link', { name: 'Settings' }).click()
  cy.location('pathname').should('equal', '/users/john/settings')

  cy.visit('/about')
  cy.findByRole('heading', { name: 'About' }).should('exist')
})
