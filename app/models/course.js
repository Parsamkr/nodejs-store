const { default: mongoose } = require("mongoose");
const { CommentSchema } = require("./public.shema");

const Episode = new mongoose.Schema(
  {
    title: { type: String, required: true },
    text: { type: String, required: true },
    type: { type: String, default: "free" },
    time: { type: String, required: "true" },
  },
  { versionKey: false }
);

const Chapter = new mongoose.Schema(
  {
    title: { type: String, required: true },
    text: { type: String, required: true },
    episodes: { type: [Episode], default: [] },
  },
  { versionKey: false }
);

const Schema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    short_text: { type: String, required: true },
    text: { type: String, required: true },
    image: { type: String, required: true },
    tags: { type: [String], default: [] },
    category: {
      type: mongoose.Types.ObjectId,
      ref: "category",
      required: true,
    },
    comments: { type: [CommentSchema], default: [] },
    likes: { type: [mongoose.Types.ObjectId], default: [] },
    dislikes: { type: [mongoose.Types.ObjectId], default: [] },
    bookmarks: { type: [mongoose.Types.ObjectId], default: [] },
    price: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    type: { type: String, required: true, default: "free" }, //free , cash , vip
    time: { type: String, default: "00:00:00" },
    teacher: { type: mongoose.Types.ObjectId, ref: "user", required: true },
    chapter: { type: [Chapter], default: [] },
    students: { type: [mongoose.Types.ObjectId], default: [], ref: "user" },
  },
  { versionKey: false }
);

module.exports = { CourseModel: mongoose.model("course", Schema) };
