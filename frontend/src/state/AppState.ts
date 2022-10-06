import { gql } from "@apollo/client";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { makeObservable, observable } from "mobx";
import { client } from "../util/apollo";
import { auth } from "../util/firebase";

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
    await this.createUser();
    await this.fetchTodos();
  }

  async logout() {
    await auth.signOut();
    this.isAuthenticated = false;
  }

  async createUser() {
    await client.mutate({
      mutation: gql`
        mutation {
          createUser {
            name
          }
        }
      `,
    });
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
