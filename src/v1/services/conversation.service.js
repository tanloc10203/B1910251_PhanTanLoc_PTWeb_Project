const { _Conversation } = require("../models/conversation.model");

class ConversationService {
  static async generateConversation({ participantId, userId }) {
    try {
      const conversationExist = await _Conversation
        .findOne({
          participant_id: participantId,
          user_id: userId,
        })
        .lean()
        .exec();

      if (conversationExist) {
        return conversationExist._id;
      }

      const conversationInsert = new _Conversation({
        participant_id: participantId,
        user_id: userId,
      });

      await conversationInsert.save();

      return conversationInsert._id;
    } catch (error) {
      console.log("error generateConversation: ", error);
      return -1;
    }
  }

  static async getByUserId({ userId, participantId }) {
    try {
      return await _Conversation
        .findOne({
          user_id: userId,
          participant_id: participantId,
        })
        .lean()
        .exec();
    } catch (error) {
      console.log("error getByUserId: ", error);
      return {};
    }
  }

  static async getAllByUserId(userId) {
    try {
      return await _Conversation.find({ user_id: userId }).lean().exec();
    } catch (error) {
      console.log("error getAllByUserId", error);
      return [];
    }
  }
}

module.exports = ConversationService;
