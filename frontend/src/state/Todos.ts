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

export class Todos {
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
    await this.query.refetch();
  }
}
