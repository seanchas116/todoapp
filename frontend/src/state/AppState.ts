import { CurrentUserStore } from "./CurrentUserStore";
import { TodoStore } from "./TodoStore";
import { io, Socket } from "socket.io-client";
import { auth } from "../util/firebase";
import { backendURL } from "../constants";

export class AppState {
  constructor() {}

  readonly currentUserStore = new CurrentUserStore();
  readonly todoStore = new TodoStore();
  socket: Socket | undefined;

  async createSocket() {
    const token = await auth.currentUser?.getIdToken();

    this.socket = io(backendURL, {
      transports: ["websocket"],
      auth: {
        // TODO: reconnect with new token when it expires
        token,
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
