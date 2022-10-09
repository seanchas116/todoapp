import { CurrentUser } from "./context";
import { getUserFromAuthHeader } from "./firebase";
import { Server as SocketIOServer, Socket } from "socket.io";
import { Server } from "http";
import { createAdapter } from "@socket.io/redis-adapter";
import { createClient } from "redis";

console.log(process.env);

const currentUserForSocket = new WeakMap<Socket, CurrentUser | undefined>();

let io: SocketIOServer | undefined;

export function getSocketIO(): SocketIOServer {
  if (!io) {
    throw new Error("SocketIO not initialized");
  }
  return io;
}

export async function initSocketIO(httpServer: Server) {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  const pubClient = createClient({ url: process.env.REDIS_URL });
  const subClient = pubClient.duplicate();

  await Promise.all([pubClient.connect(), subClient.connect()]);
  io.adapter(createAdapter(pubClient, subClient));

  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    if (token) {
      const currentUser = await getUserFromAuthHeader(`Bearer ${token}`);
      currentUserForSocket.set(socket, currentUser);
      console.log(currentUser);
    }
    next();
  });

  io.on("connection", (socket) => {
    console.log("connect socket", socket.id);

    const userId = currentUserForSocket.get(socket)?.uid;
    if (userId) {
      socket.join(userId);
      io?.to(userId).emit("message", "hello");
    }
  });
}
