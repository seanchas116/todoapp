import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client/core";
import { setContext } from "@apollo/client/link/context";
import { auth } from "./firebase";

console.log(process.env.NODE_ENV);

let uri: string;
if (process.env.NODE_ENV === "development") {
  uri = "http://localhost:4000/graphql";
} else {
  uri = "https://todoapp-xed76c3trq-uc.a.run.app/graphql";
}

const httpLink = createHttpLink({
  uri,
});

const authLink = setContext(async (_, { headers }) => {
  const token = await auth.currentUser?.getIdToken();
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
