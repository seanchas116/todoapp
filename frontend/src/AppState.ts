import {
  ApolloClient,
  createHttpLink,
  gql,
  InMemoryCache,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import createAuth0Client from "@auth0/auth0-spa-js";
import { makeObservable, observable } from "mobx";

const auth0 = await createAuth0Client({
  domain: "seanchas116.auth0.com",
  client_id: "zccoMdGHuJIdz98w3CV8TCCtHFGU323m",
  redirect_uri: window.location.origin,
});

const httpLink = createHttpLink({
  uri: "http://localhost:4000/graphql",
});

const authLink = setContext(async (_, { headers }) => {
  const token = await auth0.getTokenSilently();
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
    this.accessToken = await auth0.getTokenSilently();
    this.isAuthenticated = true;
    await this.fetchTodos();
  }

  async login() {
    await auth0.loginWithPopup();
    this.isAuthenticated = true;
    await this.fetchTodos();
  }

  async logout() {
    await auth0.logout();
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
