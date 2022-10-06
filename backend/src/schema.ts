import SchemaBuilder from "@pothos/core";
import { Todo, User } from "@prisma/client";
import { Context } from "./context";
import { prisma } from "./prisma";

const builder = new SchemaBuilder<{
  Objects: {
    User: User;
    Todo: Todo;
  };
  Context: Context;
}>({});

builder.objectType("User", {
  fields: (t) => ({
    id: t.exposeID("id"),
    name: t.exposeString("name", {
      nullable: true,
    }),
  }),
});

builder.objectType("Todo", {
  fields: (t) => ({
    id: t.exposeID("id"),
    createdAt: t.field({
      type: "String",
      resolve: (todo) => todo.createdAt.toISOString(),
    }),
    title: t.exposeString("title"),
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

builder.mutationType({
  fields: (t) => ({
    createUser: t.field({
      type: "User",
      resolve: async (_1, _2, context) => {
        if (!context.currentUser) {
          throw new Error("Not authenticated");
        }
        const id = context.currentUser.uid;
        const name = context.currentUser.name;

        return prisma.user.upsert({
          where: { id },
          update: {},
          create: {
            id,
            name,
          },
        });
      },
    }),
  }),
});

export const schema = builder.toSchema();
