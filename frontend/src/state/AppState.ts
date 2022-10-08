import { CurrentUserStore } from "./CurrentUserStore";
import { TodoStore } from "./TodoStore";
import { io, Socket } from "socket.io-client";
import { auth } from "../util/firebase";
import { client } from "../util/apollo";
import { gql } from "@apollo/client";

export class AppState {
  constructor() {}

  readonly currentUserStore = new CurrentUserStore();
  readonly todoStore = new TodoStore();
  socket: Socket | undefined;

  async createSocket() {
    const token = await auth.currentUser?.getIdToken();

    this.socket = io("http://localhost:4000", {
      auth: {
        token,
      },
    });
    this.socket.on("createTodo", (todos) => {
      console.log("createTodo", todos);
    });
    this.socket.on("updateTodo", (todos) => {
      console.log("updateTodo", todos);

      for (const todo of todos) {
        client.writeQuery({
          query: gql`
          query {
            todo(id: "${todo.id}") {
              id
              title
              status
            }
          }
        `,
          data: {
            todo: {
              ...todo,
              __typename: "Todo",
            },
          },
        });
      }
    });

    this.socket.on("deleteTodo", (todos) => {
      console.log("deleteTodo", todos);
    });
  }

  destroySocket() {
    this.socket?.disconnect();
    this.socket = undefined;
  }
}

export const appState = new AppState();
