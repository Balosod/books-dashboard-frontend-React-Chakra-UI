import React from "react";
import ReactDOM from "react-dom/client"; // React DOM for rendering the app
import { ChakraProvider } from "@chakra-ui/react"; // Chakra UI provider for styling
import { Auth0Provider } from "@auth0/auth0-react"; // Auth0 provider for authentication
import { ApolloWrapper } from "./apollo/client"; // Apollo Client provider for GraphQL
import App from "./App"; // Root App component

// Render the React app into the root div
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* Auth0Provider wraps the app to provide authentication context */}
    <Auth0Provider
      domain={process.env.REACT_APP_AUTH_DOMAIN} // Auth0 domain from environment
      clientId={process.env.REACT_APP_CLIENT_ID} // Auth0 client ID
      authorizationParams={{
        redirect_uri: window.location.origin, // redirect back to current page after login
        audience: process.env.REACT_APP_AUDIENCE, // API audience for access tokens
        scope: process.env.REACT_APP_SCOPE, // permissions requested
      }}
      cacheLocation="localstorage" // store tokens in localStorage (survive refresh)
      useRefreshTokens={true} // enable silent token refresh
    >
      {/* ChakraProvider wraps app to provide Chakra UI styling */}
      <ChakraProvider>
        {/* ApolloWrapper wraps app to provide Apollo Client context */}
        <ApolloWrapper>
          <App /> {/* Root application component */}
        </ApolloWrapper>
      </ChakraProvider>
    </Auth0Provider>
  </React.StrictMode>
);
