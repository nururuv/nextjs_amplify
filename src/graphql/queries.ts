/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getTodo = /* GraphQL */ `
  query GetTodo($id: ID!) {
    getTodo(id: $id) {
      id
      user
      name
      description
      isDone
      createdAt
      updatedAt
    }
  }
`;
export const listTodos = /* GraphQL */ `
  query ListTodos(
    $filter: ModelTodoFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTodos(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        user
        name
        description
        isDone
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

export const listTodosByMail = /* GraphQL */ `
  query listUsers($input: ModelTodoFilterInput) {
    listUsers(filter: $input) {
      items {
        firstName
        lastName
        createdAt
      }
    }
  }
`;
