const { Socket } = require("socket.io");
const ConversationService = require("./conversation.service");
const MessageService = require("./message.service");

class SocketService {
  static userJoins = [];

  /**
   *
   * @param {Socket} socket
   */
  static initializeUser = (socket) => {
    console.log("user connect: ", socket.user);

    socket.join(socket.user._id);
    this.userJoins = [...this.userJoins, socket.user];
    socket.broadcast.emit("join", this.userJoins);
    socket.emit("joins:connected", this.userJoins);
  };

  static getMessages = async (socket, payload) => {
    const conversation = await ConversationService.getByUserId({ ...payload });

    let messages = [];

    if (conversation) {
      messages = await MessageService.findByConversationId(conversation._id);
    }

    socket.emit("message:getByUserId", messages);
  };

  /**
   * @description Send typing
   * @param {Socket} socket
   * @param {{ to: String, typing: Boolean, from: string }} payload
   */
  static typingMessage = (socket, payload) => {
    socket.to(payload.to).emit("typing", payload);
  };

  /**
   *
   * @param {Socket} socket
   */
  static disconnected = (socket) => {
    socket.leave(socket.user._id);
    this.userJoins = this.userJoins.filter(
      (user) => user._id !== socket.user._id
    );
    socket.broadcast.emit("joins:disconnected", this.userJoins);
    console.log("user disconnected: ", socket.user);
  };

  /**
   * @description Send And Receiver message
   * @param {Socket} socket
   * @param {{ receiver: String, message: String, createdAt: number }} payload
   */
  static dearMessage = async (socket, payload) => {
    const sender = socket.user;
    const receiver = payload.receiver; // receiver <=> userId

    const conversationSender = await ConversationService.generateConversation({
      participantId: receiver,
      userId: sender._id,
    });

    const conversationReceiver = await ConversationService.generateConversation(
      {
        participantId: sender._id,
        userId: receiver,
      }
    );

    // * sender
    await MessageService.addMessage({
      conversationId: conversationSender._id,
      message: payload.message,
      receiver: receiver,
      sender: socket.user._id,
      createdAt: payload.createdAt,
    });

    // * receiver
    const receiverAfter = await MessageService.addMessage({
      conversationId: conversationReceiver._id,
      message: payload.message,
      receiver: receiver,
      sender: socket.user._id,
      createdAt: payload.createdAt,
    });

    socket.to(receiver).emit("message:receive", {
      ...receiverAfter._doc,
    });
  };
}

module.exports = SocketService;
