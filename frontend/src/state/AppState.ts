import { CurrentUserStore } from "./CurrentUserStore";
import { TodoStore } from "./TodoStore";
import { io, Socket } from "socket.io-client";
import { auth } from "../util/firebase";

export class AppState {
  constructor() {}

  readonly currentUserStore = new CurrentUserStore();
  readonly todoStore = new TodoStore();
  socket: Socket | undefined;

  async createSocket() {
    const token = await auth.currentUser?.getIdToken();

    this.socket = io("http://localhost:4000", {
      transports: ["websocket"],
      auth: {
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
