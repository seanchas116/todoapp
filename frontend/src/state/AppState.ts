import { CurrentUserStore } from "./CurrentUserStore";
import { TodoStore } from "./TodoStore";
import { io, Socket } from "socket.io-client";
import { auth } from "../util/firebase";

export class AppState {
  constructor() {
    this.socket = io("http://localhost:4000", {
      // TODO: auth
    });
  }

  readonly currentUserStore = new CurrentUserStore();
  readonly todoStore = new TodoStore();
  readonly socket: Socket;
}

export const appState = new AppState();
