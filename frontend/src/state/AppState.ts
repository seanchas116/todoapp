import { CurrentUserStore } from "./CurrentUserStore";
import { TodoStore } from "./TodoStore";

export class AppState {
  constructor() {}

  readonly currentUserStore = new CurrentUserStore();
  readonly todoStore = new TodoStore();
}

export const appState = new AppState();
