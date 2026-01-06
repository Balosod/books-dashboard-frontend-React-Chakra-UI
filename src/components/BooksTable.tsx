import React, { useState } from "react";
import { handleError } from "../utils/handleError"; // Utility to show errors via Chakra toast
import { useQuery, useMutation } from "@apollo/client"; // Apollo hooks for GraphQL
import { Book } from "../interface/bookInterface"; // TypeScript interface for Book
import { GET_BOOKS } from "../graphql/queries"; // GraphQL query to fetch books
import { CREATE_BOOK, UPDATE_BOOK, DELETE_BOOK } from "../graphql/mutations"; // GraphQL mutations
import BookModal from "./BookModal"; // Modal component for add/edit book
import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useDisclosure,
  useToast,
} from "@chakra-ui/react"; // Chakra UI components and hooks

const BooksTable: React.FC = () => {
  // Fetch books using Apollo useQuery
  const { loading, error, data, refetch } = useQuery(GET_BOOKS);

  const toast = useToast(); // Chakra toast for notifications

  // Apollo mutations
  const [createBook] = useMutation(CREATE_BOOK);
  const [deleteBook] = useMutation(DELETE_BOOK);
  const [updateBook] = useMutation(UPDATE_BOOK);

  // Modal controls from Chakra
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingBook, setEditingBook] = useState<Book | null>(null); // track currently editing book

  // Open modal to create a new book
  const openCreateModal = () => {
    setEditingBook(null); // reset editing state
    onOpen();
  };

  // Open modal to edit an existing book
  const openEditModal = (book: Book) => {
    setEditingBook(book);
    onOpen();
  };

  // Save handler for both create and update
  const handleSave = async (bookData: {
    name: string;
    description: string;
  }) => {
    try {
      if (editingBook) {
        // Update existing book
        await updateBook({
          variables: { id: Number(editingBook.id), data: bookData },
        });
        toast({
          title: "Book updated",
          description: `"${bookData.name}" has been updated successfully.`,
          status: "success",
          duration: 4000,
          isClosable: true,
        });
      } else {
        // Create new book
        await createBook({ variables: { data: bookData } });
        toast({
          title: "Book created",
          description: `"${bookData.name}" has been added successfully.`,
          status: "success",
          duration: 4000,
          isClosable: true,
        });
      }
      refetch(); // refresh the table
      onClose(); // close modal
    } catch (err: any) {
      console.log("error", err);
      handleError(err, toast); // show error toast
    }
  };

  // Delete a book
  const handleDelete = async (id: number) => {
    try {
      await deleteBook({ variables: { id: Number(id) } });
      toast({
        title: "Book deleted",
        description: "Book has been deleted successfully.",
        status: "success",
        duration: 4000,
        isClosable: true,
      });
      refetch(); // refresh the table
    } catch (err: any) {
      handleError(err, toast);
    }
  };

  // Show loading state while fetching
  if (loading) return <Box>Loading...</Box>;

  // Show error toast if fetching fails
  if (error) {
    toast({
      title: "Error fetching books",
      description: error.message,
      status: "error",
      duration: 5000,
      isClosable: true,
    });
  }

  return (
    <Box overflowX="auto">
      {/* Button to open modal to add a new book */}
      <Button colorScheme="blue" mb={4} onClick={openCreateModal}>
        Add Book
      </Button>

      {/* Table displaying books */}
      <Table variant="simple" size={{ base: "sm", md: "md" }}>
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Name</Th>
            <Th>Description</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.getBooks.map((book: Book, index: number) => (
            <Tr key={book.id}>
              <Td>{index + 1}</Td> {/* Display serial number */}
              <Td>{book.name}</Td>
              <Td>{book.description}</Td>
              <Td>
                {/* Edit button opens modal with selected book */}
                <Button size="sm" mr={2} onClick={() => openEditModal(book)}>
                  Edit
                </Button>
                {/* Delete button removes the book */}
                <Button
                  size="sm"
                  colorScheme="red"
                  onClick={() => handleDelete(book.id)}
                >
                  Delete
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {/* Modal component for add/edit book */}
      <BookModal
        isOpen={isOpen}
        onClose={onClose}
        editingBook={editingBook}
        onSave={handleSave}
      />
    </Box>
  );
};

export default BooksTable;
