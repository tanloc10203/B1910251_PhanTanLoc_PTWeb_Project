const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  conversation_id: {
    type: mongoose.Schema.Types.ObjectId,
    index: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
  },
  message: {
    type: String,
    required: true,
  },
  is_undo: {
    type: Boolean,
    default: false,
    index: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

messageSchema.index({ createdAt: true, conversation_id: true, is_undo: true });

module.exports._Message = mongoose.model("Messages", messageSchema);
