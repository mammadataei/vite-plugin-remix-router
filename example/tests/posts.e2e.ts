import { randPost } from '@ngneat/falso'
import { slugify } from '../src/utils'

it('should fetch and render posts', () => {
  const posts = randPost({ length: 10 })

  cy.intercept('GET', '/api/posts', (request) => {
    request.reply({ posts })
  })

  cy.visit('/posts')

  posts.forEach((post) => {
    cy.findByText(post.title).should('exist')
  })
})

it.only('should fetch and render posts', () => {
  const post = randPost()

  cy.intercept('GET', `/api/posts/${slugify(post.title)}`, (request) => {
    request.reply({ post })
  })

  cy.visit(`/posts/${slugify(post.title)}`)

  cy.findByText(post.title).should('exist')
  cy.findByText(post.body).should('exist')
})
