const { default: mongoose } = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    DateTime: {
      type: Date,
      default: new Date().getTime(),
    },
  },
  { versionKey: false, toJSON: { virtuals: true } }
);

const RoomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    messages: {
      type: [MessageSchema],
      default: [],
    },
  },
  { versionKey: false, toJSON: { virtuals: true } }
);

const ConversationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    endpoint: {
      type: String,
      required: true,
    },
    rooms: {
      type: [RoomSchema],
      default: [],
    },
  },
  { versionKey: false, toJSON: { virtuals: true } }
);

module.exports = {
  ConversationModel: mongoose.model("conversation", ConversationSchema),
};
