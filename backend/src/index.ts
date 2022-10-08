import { createServer } from "@graphql-yoga/node";
import { Context } from "./context";
import { getUserFromAuthHeader } from "./firebase";
import { schema } from "./schema";
import { initSocketIO } from "./socketio";

async function init() {
  const server = createServer({
    schema,
    context: async ({ req }): Promise<Context> => ({
      currentUser: await getUserFromAuthHeader(req.headers.authorization),
    }),
    maskedErrors: false,
  });

  const httpServer = await server.start();

  await initSocketIO(httpServer);
}

init();
