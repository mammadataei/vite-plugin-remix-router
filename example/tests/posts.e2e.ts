import { randPost } from '@ngneat/falso'
import { slugify } from '../src/utils'

it('should fetch and render all posts', () => {
  const posts = randPost({ length: 10 })

  cy.intercept('GET', '/api/posts', (request) => {
    request.reply({ posts })
  })

  cy.visit('/posts')

  posts.forEach((post) => {
    cy.findByText(post.title).should('exist')
  })
})

it('should `ErrorBoundary` when error occurs', () => {
  cy.intercept('GET', '/api/posts', (request) => {
    request.reply({ statusCode: 400 })
  })

  cy.visit('/posts')

  cy.findByText('Oops! Something went wrong.').should('exist')
})

it('should fetch and render a post by its slug', () => {
  const post = randPost()

  cy.intercept('GET', `/api/posts/${slugify(post.title)}`, (request) => {
    request.reply({ post })
  })

  cy.visit(`/posts/${slugify(post.title)}`)

  cy.findByText(post.title).should('exist')
  cy.findByText(post.body).should('exist')
})

it('should render `ErrorElement` when error occurs', () => {
  cy.intercept('GET', `/api/posts/hello-world`, (request) => {
    request.reply({
      statusCode: 404,
      body: {
        error: {
          message: 'Post Not Found.',
        },
      },
    })
  })

  cy.visit(`/posts/hello-world`)

  cy.findByText('Post Not Found.').should('exist')
})

it('should create a new post', () => {
  const post = {
    title: 'Hello world',
    body: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit.',
  }
  cy.intercept('POST', '/api/posts', (request) => {
    request.reply({ message: 'Post created successfully.' })
  }).as('createPost')

  cy.visit('/posts/create')

  cy.findByLabelText('Title').type(post.title)
  cy.findByLabelText('Body').type(post.body)
  cy.findByRole('button').click()

  cy.get('@createPost').its('request.body').should('deep.equal', post)
  cy.findByText('Post created successfully.').should('exist')
})
