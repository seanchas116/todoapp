import SchemaBuilder from "@pothos/core";
import { Todo, User } from "@prisma/client";
import { prisma } from "./prisma";

const builder = new SchemaBuilder<{
  Objects: {
    User: User;
    Todo: Todo;
  };
}>({});

builder.objectType("User", {
  fields: (t) => ({
    id: t.exposeID("id"),
    name: t.exposeString("name", {
      nullable: true,
    }),
  }),
});

builder.queryType({
  fields: (t) => ({
    users: t.field({
      type: ["User"],
      resolve: async () => prisma.user.findMany(),
    }),
    todos: t.field({
      type: ["Todo"],
      resolve: async () => {
        // TODO: filter by current user
        return prisma.todo.findMany();
      },
    }),
  }),
});

export const schema = builder.toSchema();
