import { createServer } from "@graphql-yoga/node";
import { Context, CurrentUser } from "./context";
import { getUserFromAuthHeader } from "./firebase";
import { schema } from "./schema";
import { Server as SocketIOServer, Socket } from "socket.io";

const currentUserForSocket = new WeakMap<Socket, CurrentUser | undefined>();

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

  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    if (token) {
      const currentUser = await getUserFromAuthHeader(`Bearer ${token}`);
      currentUserForSocket.set(socket, currentUser);
    }
    next();
  });

  io.on("connection", (socket) => {
    console.log("connect socket", socket.id);
  });
}

init();
