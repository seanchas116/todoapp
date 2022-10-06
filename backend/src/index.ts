import { createServer } from "@graphql-yoga/node";
import { Context } from "./context";
import { getUserFromAuthHeader } from "./firebase";
import { schema } from "./schema";

const server = createServer({
  schema,
  context: async ({ req }): Promise<Context> => ({
    currentUser: await getUserFromAuthHeader(req.headers.authorization),
  }),
});

server.start();
