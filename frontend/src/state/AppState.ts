import { CurrentUserStore } from "./CurrentUserStore";
import { TodoStore } from "./TodoStore";
import { io, Socket } from "socket.io-client";
import { auth, getIDToken } from "../util/firebase";
import { backendURL } from "../constants";
import { getIdToken } from "firebase/auth";

export class AppState {
  constructor() {}

  readonly currentUserStore = new CurrentUserStore();
  readonly todoStore = new TodoStore();
  socket: Socket | undefined;

  async createSocket() {
    this.socket = io(backendURL, {
      transports: ["websocket"],
      auth: (cb) => {
        getIDToken().then((token) => {
          cb({ token });
        });
      },
    });
    this.socket.on("todos", () => {
      this.todoStore.refreshAll();
    });
  }

  destroySocket() {
    this.socket?.disconnect();
    this.socket = undefined;
  }
}

export const appState = new AppState();
