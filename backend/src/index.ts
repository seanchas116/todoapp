import { createServer } from "@graphql-yoga/node";
import { getUserFromAuthHeader } from "./firebase";
import { schema } from "./schema";

const server = createServer({
  schema,
  context: async ({ req }) => ({
    // This part is up to you!
    currentUser: await getUserFromAuthHeader(req.headers.authorization),
  }),
});

server.start();
