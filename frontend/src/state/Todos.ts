import { gql } from "@apollo/client";
import { observable } from "mobx";
import { client } from "../util/apollo";

interface Todo {
  id: number;
  createdAt: string;
  updatedAt: string;
  title: string;
  status: "done" | "pending";
}

export class Todos {
  readonly todos = observable.array<Todo>();

  async fetch() {
    const todos = await client.query({
      query: gql`
        query {
          todos {
            id
            createdAt
            updatedAt
            title
            status
          }
        }
      `,
    });
    this.todos.push(...todos.data.todos);
  }
}
