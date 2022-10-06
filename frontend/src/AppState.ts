import {
  ApolloClient,
  createHttpLink,
  getApolloContext,
  gql,
  InMemoryCache,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { makeObservable, observable } from "mobx";
import { app, auth } from "./firebase";

const httpLink = createHttpLink({
  uri: "http://localhost:4000/graphql",
});

const authLink = setContext(async (_, { headers }) => {
  const token = await auth.currentUser?.getIdToken(true);
  console.log(token);
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

const googleAuthProvider = new GoogleAuthProvider();

export class AppState {
  constructor() {
    void this.init();
    makeObservable(this);
  }

  accessToken: string | undefined;
  @observable isAuthenticated = false;

  async init() {
    // TODO
  }

  async login() {
    await signInWithPopup(auth, googleAuthProvider);

    console.log(auth.currentUser);

    this.isAuthenticated = true;
    await this.fetchTodos();
  }

  async logout() {
    await auth.signOut();
    this.isAuthenticated = false;
  }

  async fetchTodos() {
    const todos = await client.query({
      query: gql`
        query {
          todos {
            title
          }
        }
      `,
    });

    console.log(todos);
  }
}

export const appState = new AppState();
