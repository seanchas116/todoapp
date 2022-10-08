import { gql } from "@apollo/client/core";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { computed, makeObservable, observable, runInAction } from "mobx";
import { client } from "../util/apollo";
import { auth } from "../util/firebase";
import { appState } from "./AppState";

const googleAuthProvider = new GoogleAuthProvider();

interface User {
  id: string;
  name: string | null;
  avatar: string | null;
}

export class CurrentUserStore {
  constructor() {
    makeObservable(this);
    auth.onAuthStateChanged(async (user) => {
      await this.upsertUser();
      this.refreshAfterLogin();
    });
  }

  @observable.ref user: User | undefined = undefined;

  @computed get isAuthenticated() {
    return this.user !== undefined;
  }

  async login() {
    await signInWithPopup(auth, googleAuthProvider);
    await this.upsertUser();
    await this.refreshAfterLogin();
  }

  async logout() {
    await auth.signOut();
    this.user = undefined;
  }

  async upsertUser() {
    const result = await client.mutate({
      mutation: gql`
        mutation {
          createUser {
            id
            name
            avatar
          }
        }
      `,
    });

    this.user = result.data.createUser;
  }

  private async refreshAfterLogin() {
    await appState.todoStore.refreshAll();
  }
}
