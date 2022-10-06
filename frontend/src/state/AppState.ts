import { CurrentUser } from "./CurrentUser";
import { Todos } from "./Todos";

export class AppState {
  constructor() {}

  readonly currentUser = new CurrentUser();
  readonly todos = new Todos();
}

export const appState = new AppState();
