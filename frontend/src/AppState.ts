import { ApolloClient, gql, InMemoryCache } from "@apollo/client";
import createAuth0Client from "@auth0/auth0-spa-js";
import { makeObservable, observable } from "mobx";

const auth0 = await createAuth0Client({
  domain: "seanchas116.auth0.com",
  client_id: "zccoMdGHuJIdz98w3CV8TCCtHFGU323m",
  redirect_uri: window.location.origin,
});

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache(),
});

export class AppState {
  constructor() {
    void this.init();
    makeObservable(this);

    client
      .query({
        query: gql`
          query {
            todos {
              title
            }
          }
        `,
      })
      .then((result) => console.log(result));
  }

  @observable isAuthenticated = false;

  async init() {
    await auth0.getTokenSilently();
    this.isAuthenticated = true;
  }

  async login() {
    await auth0.loginWithPopup();
    this.isAuthenticated = true;
  }

  async logout() {
    await auth0.logout();
  }
}

export const appState = new AppState();
