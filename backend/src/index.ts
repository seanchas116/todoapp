import { createServer } from "@graphql-yoga/node";
import { Context } from "./context";
import { getUserFromAuthHeader } from "./firebase";
import { schema } from "./schema";
import { Server as SocketIOServer } from "socket.io";

async function init() {
  const server = createServer({
    schema,
    context: async ({ req }): Promise<Context> => ({
      currentUser: await getUserFromAuthHeader(req.headers.authorization),
    }),
    maskedErrors: false,
  });

  const httpServer = await server.start();

  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    console.log("connect socket", socket.id);
  });
}

init();
