import { gql } from "@apollo/client/core";
import { client } from "../util/apollo";
import { MobxQuery } from "../util/mobx";

interface Todo {
  id: number;
  createdAt: string;
  updatedAt: string;
  title: string;
  status: "done" | "pending";
}

export class TodoStore {
  private readonly query = client.watchQuery<{
    todos: Todo[];
  }>({
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

  readonly _todos = new MobxQuery(this.query);

  get todos(): Todo[] {
    return this._todos.value?.todos ?? [];
  }

  async refreshAll() {
    await this.query.refetch();
  }

  async create(title: string) {
    await client.mutate({
      mutation: gql`
        mutation createTodo($title: String!) {
          createTodo(title: $title) {
            id
            createdAt
            updatedAt
            title
            status
          }
        }
      `,
      variables: {
        title,
      },
    });
    await this.query.refetch();
  }

  async update(todo: Todo) {
    await client.mutate({
      mutation: gql`
        mutation updateTodo($id: Int!, $title: String!, $status: String!) {
          updateTodo(id: $id, title: $title, status: $status) {
            id
            createdAt
            updatedAt
            title
            status
          }
        }
      `,
      variables: {
        id: todo.id,
        title: todo.title,
        status: todo.status,
      },
      optimisticResponse: {
        updateTodo: todo,
      },
    });
  }

  async clearCompleted() {
    await client.mutate({
      mutation: gql`
        mutation {
          deleteDoneTodos
        }
      `,
    });
    await this.query.refetch();
  }
}
