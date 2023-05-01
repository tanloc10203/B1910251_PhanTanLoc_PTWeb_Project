const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
  participant_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

conversationSchema.index({ participant_id: true, user_id: true });

module.exports._Conversation = mongoose.model(
  "Conversations",
  conversationSchema
);
