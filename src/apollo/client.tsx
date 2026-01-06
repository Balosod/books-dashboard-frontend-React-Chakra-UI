import React from "react";
import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  ApolloProvider,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { useAuth0 } from "@auth0/auth0-react";

interface Props {
  children: React.ReactNode;
}

// Wrapper component to provide Apollo Client with Auth0 authentication
export const ApolloWrapper: React.FC<Props> = ({ children }) => {
  // Destructure Auth0 hooks to manage authentication state and tokens
  const {
    isAuthenticated, // whether the user is logged in
    isLoading, // whether Auth0 is still loading the auth state
    getAccessTokenSilently, // method to get access token without redirecting
    loginWithRedirect, // method to force login redirect if token fails
  } = useAuth0();

  // HTTP link to connect Apollo Client to GraphQL endpoint
  const httpLink = React.useMemo(
    () =>
      createHttpLink({
        uri: process.env.REACT_APP_AUTH_URL, // your GraphQL endpoint from .env
      }),
    []
  );

  // Middleware link to attach the access token to requests
  const authLink = React.useMemo(
    () =>
      setContext(async (_, { headers }) => {
        // If user is not authenticated or Auth0 is still loading, return existing headers
        if (!isAuthenticated || isLoading) return { headers };

        try {
          // Try to get access token silently
          const token = await getAccessTokenSilently({
            authorizationParams: {
              audience: process.env.REACT_APP_AUDIENCE, // Auth0 API audience
            },
          });

          // Attach token to headers for authenticated requests
          return {
            headers: {
              ...headers,
              Authorization: token ? `Bearer ${token}` : "",
            },
          };
        } catch (e) {
          // If token cannot be obtained silently, redirect to login
          loginWithRedirect({
            authorizationParams: { audience: process.env.REACT_APP_AUDIENCE },
          });
          return { headers }; // return headers anyway to prevent breaking requests
        }
      }),
    [isAuthenticated, isLoading, getAccessTokenSilently, loginWithRedirect]
  );

  // Initialize Apollo Client with authLink + httpLink and in-memory cache
  const client = React.useMemo(
    () =>
      new ApolloClient({
        link: authLink.concat(httpLink), // combine auth middleware and HTTP link
        cache: new InMemoryCache(), // in-memory caching for Apollo
      }),
    [authLink, httpLink]
  );

  // While Auth0 is loading, show a loading indicator instead of rendering children
  if (isLoading) return <div>Loading...</div>;

  // Provide Apollo Client to the component tree
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
