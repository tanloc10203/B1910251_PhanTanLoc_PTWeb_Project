const { Socket } = require("socket.io");
const ConversationService = require("./conversation.service");
const MessageService = require("./message.service");

class SocketService {
  static userJoins = [];

  /**
   *
   * @param {Socket} socket
   */
  static initializeUser = async (socket) => {
    console.log("user connect: ", socket.user);
    socket.join(socket.user._id);

    this.userJoins = [...this.userJoins, socket.user];

    const conversations = await ConversationService.getAllByUserId(
      socket.user._id
    );

    console.log("conversations", conversations);

    let resultCountNotifications = await Promise.all(
      conversations.map(async (c) => ({
        _id: c._id.toString(),
        participant_id: c.participant_id.toString(),
        count: await MessageService.countIsNotWatched(c._id),
      }))
    );

    resultCountNotifications = resultCountNotifications.reduce(
      (acc, value) => (acc = { ...acc, [value.participant_id]: value.count }),
      {}
    );

    console.log("resultCountNotifications", resultCountNotifications);

    socket.broadcast.emit("join", this.userJoins);
    socket.emit("notification:init", { result: resultCountNotifications });
    socket.emit("joins:connected", this.userJoins);
  };

  /**
   * @description Get message by userId and participantId
   * @param {Socket} socket
   * @param {{ userId: String, participantId: String }} payload
   * @returns {Promise<void>}
   */
  static getMessages = async (socket, payload) => {
    const conversation = await ConversationService.getByUserId({ ...payload });

    let messages = [];
    let countNotification = 0;

    if (conversation) {
      messages = await MessageService.findByConversationId(conversation._id);
      await MessageService.updateIsWatched(conversation._id);
      countNotification = await MessageService.countIsNotWatched(
        conversation._id
      );
    }

    socket.emit("notification:count", {
      [payload.participantId]: countNotification,
    });
    socket.emit("message:getByUserId", messages);
  };

  /**
   * @description Send typing
   * @param {Socket} socket
   * @param {{ to: String, typing: Boolean, from: string }} payload
   */
  static typingMessage = async (socket, payload) => {
    socket.to(payload.to).emit("typing", payload);

    const conversation = await ConversationService.getByUserId({
      participantId: payload.to,
      userId: payload.from,
    });

    if (conversation) {
      await MessageService.updateIsWatched(conversation._id);

      const countNotification = await MessageService.countIsNotWatched(
        conversation._id
      );

      socket.emit("notification:count", { [payload.to]: countNotification });
    }
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
      isWatched: true,
    });

    // * receiver
    const receiverAfter = await MessageService.addMessage({
      conversationId: conversationReceiver._id,
      message: payload.message,
      receiver: receiver,
      sender: socket.user._id,
      createdAt: payload.createdAt,
    });

    // * notification receiver.
    const countNotification = await MessageService.countIsNotWatched(
      conversationReceiver._id
    );

    socket
      .to(receiver)
      .emit("notification:count", { [sender._id]: countNotification });

    socket
      .to(receiver)
      .emit("typing", { to: receiver, typing: false, from: sender._id });

    socket.to(receiver).emit("message:receive", {
      ...receiverAfter._doc,
    });
  };
}

module.exports = SocketService;
