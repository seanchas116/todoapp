import { gql } from "@apollo/client";
import { observable, toJS } from "mobx";
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
    this.todos.replace(todos.data.todos);
    console.log(toJS(this.todos));
  }

  async create(title: string) {
    const todo = await client.mutate({
      mutation: gql`
        mutation {
          createTodo(title: "${title}") {
            id
            createdAt
            updatedAt
            title
            status
          }
        }
      `,
    });
    await this.fetch();
  }
}
