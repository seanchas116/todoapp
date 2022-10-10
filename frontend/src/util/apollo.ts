import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client/core";
import { setContext } from "@apollo/client/link/context";
import { backendURL } from "../constants";
import { getIDToken } from "./firebase";

const httpLink = createHttpLink({
  uri: `${backendURL}/graphql`,
});

const authLink = setContext(async (_, { headers }) => {
  const token = await getIDToken();
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
