import { gql } from "@apollo/client";

// Mutation to get all books
export const GET_BOOKS = gql`
  query GetBooks {
    getBooks {
      id
      name
      description
    }
  }
`;
