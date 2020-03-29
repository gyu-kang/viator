const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    createdAt: String!
    updatedAt: String
    posts: [Post!]
  }

  type Post {
    id: ID!
    user: User!
    title: String!
    startDate: String!
    endDate: String!
    markdownText: String!
    tags: [Tag!]
    createdAt: String!
    updatedAt: String
  }

  type Tag {
    id: ID!
    name: String!
    posts: [Post!]
  }

  type Query {
    posts(contain: PostWhereInput): [Post!]
    post(id: ID!): Post

    tags: [Tag!]
    tag(id: ID!): Tag
  }

  type Mutation {
    signIn(id: String!, password: String!): String!
    signOut: Boolean!

    createPost(post: PostInput!): Post!
    updatePost(id: ID!, post: PostInput!): Post!
    deletePost(id: ID!): Post!

    uploadImage(file: Upload!): String!
  }

  input PostInput {
    title: String!
    startDate: String!
    endDate: String!
    markdownText: String!
    tags: [String!]
  }

  input PostWhereInput {
    text: String
    tag: String
  }
`;

module.exports = typeDefs;
