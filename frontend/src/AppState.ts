import {
  ApolloClient,
  createHttpLink,
  getApolloContext,
  gql,
  InMemoryCache,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { makeObservable, observable } from "mobx";
import { app } from "./firebase";

const provider = new GoogleAuthProvider();

const httpLink = createHttpLink({
  uri: "http://localhost:4000/graphql",
});

const authLink = setContext(async (_, { headers }) => {
  const token = await getAuth(app).currentUser?.getIdToken(true);
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
    await signInWithPopup(getAuth(app), provider);

    console.log(getAuth(app).currentUser);

    this.isAuthenticated = true;
    await this.fetchTodos();
  }

  async logout() {
    await getAuth(app).signOut();
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
