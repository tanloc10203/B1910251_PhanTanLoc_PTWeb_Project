const { _Message } = require("../models/message.model");

class MessageService {
  static async addMessage({
    conversationId,
    sender,
    receiver,
    message,
    createdAt,
    isWatched = false,
  }) {
    try {
      const messageInsert = new _Message({
        message,
        sender,
        conversation_id: conversationId,
        receiver,
        createdAt,
        is_watched: isWatched,
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

  static async countIsNotWatched(conversationId) {
    try {
      const result = await _Message
        .countDocuments({
          conversation_id: conversationId,
          is_watched: false,
        })
        .lean()
        .exec();

      return result;
    } catch (error) {
      console.log("error countIsNotWatched");
      return 0;
    }
  }

  static async updateIsWatched(conversationId) {
    try {
      await _Message.updateMany(
        { conversation_id: conversationId },
        { $set: { is_watched: true } }
      );

      return true;
    } catch (error) {
      console.log("error updateIsWatched", error);
    }
  }
}

module.exports = MessageService;
