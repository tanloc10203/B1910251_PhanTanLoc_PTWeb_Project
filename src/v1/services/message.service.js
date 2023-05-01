const { _Message } = require("../models/message.model");

class MessageService {
  static async addMessage({
    conversationId,
    sender,
    receiver,
    message,
    createdAt,
  }) {
    try {
      const messageInsert = new _Message({
        message,
        sender,
        conversation_id: conversationId,
        receiver,
        createdAt,
      });

      return await messageInsert.save();
    } catch (error) {
      console.log("error addMessage", error);
    }
  }

  static async findByConversationId(id) {
    try {
      return await _Message
        .find({
          conversation_id: id,
        })
        .lean()
        .exec();
    } catch (error) {
      console.log("find findByReservationId", error);
    }
  }
}

module.exports = MessageService;
