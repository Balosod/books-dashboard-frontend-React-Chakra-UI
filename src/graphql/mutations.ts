import { gql } from "@apollo/client";

// Mutation to create a new book
export const CREATE_BOOK = gql`
  mutation CreateBook($data: BookInput!) {
    createBook(data: $data) {
      id
      name
      description
    }
  }
`;

// Mutation to update an existing book
export const UPDATE_BOOK = gql`
  mutation UpdateBook($id: Float!, $data: UpdateBookInput!) {
    updateBook(id: $id, data: $data) {
      id
      name
      description
    }
  }
`;

// Mutation to delete a book
export const DELETE_BOOK = gql`
  mutation DeleteBook($id: Float!) {
    deleteBook(id: $id)
  }
`;
