import { gql } from "@apollo/client/core";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { makeObservable, observable } from "mobx";
import { client } from "../util/apollo";
import { auth } from "../util/firebase";
import { appState } from "./AppState";

const googleAuthProvider = new GoogleAuthProvider();

export class CurrentUserStore {
  constructor() {
    makeObservable(this);
    auth.onAuthStateChanged((user) => {
      this.isAuthenticated = user !== null;
      this.refreshAfterLogin();
    });
  }

  @observable isAuthenticated = false;

  async login() {
    await signInWithPopup(auth, googleAuthProvider);

    this.isAuthenticated = true;
    await this.createUser();
    await this.refreshAfterLogin();
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

  private async refreshAfterLogin() {
    await appState.todoStore.refreshAll();
  }
}
