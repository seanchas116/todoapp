import SchemaBuilder from "@pothos/core";
import { User } from "@prisma/client";
import { prisma } from "./prisma";

const builder = new SchemaBuilder<{
  Objects: {
    User: User;
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
  }),
});

export const schema = builder.toSchema();
