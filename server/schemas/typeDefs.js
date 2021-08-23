const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    bookCount: Number
    savedBooks: [bookSchema]!
  }

  type Book {
    _id: ID
    bookId: String
    authors: [String]
    description: String
    title: String
    image: String
    link: String
  }

  type Auth {
    token: ID!
    user: User
  }

  type bookSchema {
    authors: [String]!
    description: String
    bookId: String
    image: String
    link: String
    title: String
  }

  type Query {
    me(username: String, id: ID): User
  }

  type Mutation {
    login(username: String!, email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(authors: [String], bookId: String, description: String, title: String, image: String, link: String): User
    removeBook(bookId: String): User
  }
`;

module.exports = typeDefs;