const { createServer } = require("http");
const { Server } = require("socket.io");
const { wrap, sessionMiddleware } = require("./utils/options");
const SocketMiddleware = require("./middlewares/socket.middleware");
const SocketService = require("./services/socket.service");

const initialSocketIo = (app) => {
  const httpServer = createServer(app);

  const io = new Server(httpServer, {
    cors: {
      origin: process.env.URL_CLIENT,
      credentials: true,
    },
  });

  io.use(wrap(sessionMiddleware(app)));
  io.use(SocketMiddleware.auth);

  io.on("connect", async (socket) => {
    await SocketService.initializeUser(socket);

    socket.on(
      "message:send",
      async (payload) => await SocketService.dearMessage(socket, payload)
    );

    socket.on(
      "message:getByUserId",
      async (payload) => await SocketService.getMessages(socket, payload)
    );

    socket.on(
      "typing",
      async (payload) => await SocketService.typingMessage(socket, payload)
    );

    socket.on("disconnecting", () => SocketService.disconnected(socket));
  });

  return httpServer;
};

module.exports = {
  initialSocketIo,
};
