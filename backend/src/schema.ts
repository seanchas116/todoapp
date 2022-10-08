import SchemaBuilder from "@pothos/core";
import { Todo, TodoStatus, User } from "@prisma/client";
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
    id: t.exposeInt("id"),
    createdAt: t.field({
      type: "String",
      resolve: (todo) => todo.createdAt.toISOString(),
    }),
    updatedAt: t.field({
      type: "String",
      resolve: (todo) => todo.updatedAt.toISOString(),
    }),
    title: t.exposeString("title"),
    status: t.exposeString("status"),
  }),
});

builder.queryType({
  fields: (t) => ({
    todos: t.field({
      type: ["Todo"],
      resolve: async (_1, _2, context) => {
        if (!context.currentUser) {
          throw new Error("Not authenticated");
        }

        // TODO: filter by current user
        return prisma.todo.findMany({
          where: {
            userId: context.currentUser.uid,
          },
          orderBy: {
            createdAt: "desc",
          },
        });
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
    createTodo: t.field({
      type: "Todo",
      args: {
        title: t.arg.string({ required: true }),
      },
      resolve: async (_1, { title }, context) => {
        if (!context.currentUser) {
          throw new Error("Not authenticated");
        }

        return prisma.todo.create({
          data: {
            title,
            userId: context.currentUser.uid,
          },
        });
      },
    }),
    updateTodo: t.field({
      type: "Todo",
      args: {
        id: t.arg.int({ required: true }),
        title: t.arg.string({ required: true }),
        status: t.arg.string({ required: true }),
      },
      resolve: async (_1, { id, title, status }, context) => {
        if (!context.currentUser) {
          throw new Error("Not authenticated");
        }

        if (!(status in TodoStatus)) {
          throw new Error("Invalid status");
        }

        return prisma.todo.update({
          where: { id },
          data: {
            title,
            status: status as TodoStatus,
          },
        });
      },
    }),
    deleteTodo: t.field({
      type: "Todo",
      args: {
        id: t.arg.int({ required: true }),
      },
      resolve: async (_1, { id }, context) => {
        if (!context.currentUser) {
          throw new Error("Not authenticated");
        }

        return prisma.todo.delete({
          where: { id },
        });
      },
    }),
    deleteDoneTodos: t.field({
      type: "Boolean",
      resolve: async (_1, _2, context) => {
        if (!context.currentUser) {
          throw new Error("Not authenticated");
        }

        await prisma.todo.deleteMany({
          where: {
            userId: context.currentUser.uid,
            status: TodoStatus.done,
          },
        });

        return true;
      },
    }),
  }),
});

export const schema = builder.toSchema();
