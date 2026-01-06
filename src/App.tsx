import React from "react";
import { Box, Heading, Container, Text } from "@chakra-ui/react"; // Chakra UI components
import BooksTable from "./components/BooksTable"; // Table component to list and manage books
import { AuthButton } from "./components/AuthButton"; // Login / Logout buttons
import { useAuth0 } from "@auth0/auth0-react"; // Auth0 hook to manage authentication

const App: React.FC = () => {
  // Destructure Auth0 hooks to get auth state
  const { isAuthenticated, isLoading } = useAuth0();

  // Show loading state while Auth0 is initializing
  if (isLoading) {
    return (
      <Container maxW="container.lg" py={8}>
        <Heading mb={6}>Books Dashboard</Heading>
        <Text>Loading authentication...</Text>
      </Container>
    );
  }

  return (
    <Container maxW="container.lg" py={8}>
      {/* Page title */}
      <Heading mb={6}>Books Dashboard</Heading>

      {/* Auth0 Login / Logout button */}
      <AuthButton />

      {/* Show BooksTable only if the user is authenticated */}
      {isAuthenticated ? (
        <Box mt={4}>
          <BooksTable /> {/* Table to view and manage books */}
        </Box>
      ) : (
        // Message for unauthenticated users
        <Text mt={4} fontStyle="italic">
          Please log in to view and manage your books.
        </Text>
      )}
    </Container>
  );
};

export default App;
