import { gql } from "@apollo/client/core";
import { client } from "../util/apollo";
import { ZenMobxBridge } from "../util/mobx";

interface Todo {
  id: number;
  createdAt: string;
  updatedAt: string;
  title: string;
  status: "done" | "pending";
}

export class TodoStore {
  readonly query = client.watchQuery({
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

  readonly todos = new ZenMobxBridge<Todo[]>(
    this.query.map((result) => result.data.todos),
    []
  );

  async create(title: string) {
    await client.mutate({
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
    await this.query.refetch();
  }

  async update(todo: Todo) {
    await client.mutate({
      mutation: gql`
        mutation {
          updateTodo(
            id: ${JSON.stringify(todo.id)}
            title: ${JSON.stringify(todo.title)}
            status: ${JSON.stringify(todo.status)}
          ) {
            id
            createdAt
            updatedAt
            title
            status
          }
        }
      `,
    });
  }
}
