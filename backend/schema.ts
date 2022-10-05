import SchemaBuilder from "@pothos/core";
import { User } from "@prisma/client";

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
      resolve: async () => [],
    }),
  }),
});

export const schema = builder.toSchema();
