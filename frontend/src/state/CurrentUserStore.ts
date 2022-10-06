import { gql } from "@apollo/client/core";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { makeObservable, observable } from "mobx";
import { client } from "../util/apollo";
import { auth } from "../util/firebase";
import { appState } from "./AppState";

const googleAuthProvider = new GoogleAuthProvider();

export class CurrentUserStore {
  constructor() {
    void this.init();
    makeObservable(this);
  }

  @observable isAuthenticated = false;

  async init() {
    // TODO
  }

  async login() {
    await signInWithPopup(auth, googleAuthProvider);

    console.log(auth.currentUser);

    this.isAuthenticated = true;
    await this.createUser();
    await appState.todoStore.query.refetch();
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
}
