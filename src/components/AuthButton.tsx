import React from "react";
import { Button, Box } from "@chakra-ui/react"; // Chakra UI components for layout and buttons
import { useAuth0 } from "@auth0/auth0-react"; // Auth0 React SDK hook

// Button component that handles login, logout, and signup using Auth0
export const AuthButton: React.FC = () => {
  // Destructure Auth0 methods and authentication state
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0();

  return (
    // Container box with bottom margin and horizontal spacing
    <Box mb={4} display="flex" gap={2}>
      {isAuthenticated ? (
        // If user is logged in, show logout button
        <Button
          colorScheme="red"
          onClick={
            () => logout({ returnTo: window.location.origin }) // log out and return to home
          }
        >
          Logout
        </Button>
      ) : (
        // If user is not logged in, show Sign In and Sign Up buttons
        <>
          <Button
            colorScheme="blue"
            onClick={() =>
              loginWithRedirect({
                authorizationParams: {
                  audience: process.env.REACT_APP_AUDIENCE, // Auth0 API audience
                },
              })
            }
          >
            Sign In
          </Button>
          <Button
            colorScheme="green"
            onClick={() =>
              loginWithRedirect({
                authorizationParams: {
                  audience: process.env.REACT_APP_AUDIENCE, // only audience needed for signup
                },
              })
            }
          >
            Sign Up
          </Button>
        </>
      )}
    </Box>
  );
};
