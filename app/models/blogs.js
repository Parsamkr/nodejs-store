const { default: mongoose } = require("mongoose");
const { CommentSchema } = require("./public.shema");

const BlogSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Types.ObjectId, ref: "user", required: true },
    title: { type: String, required: true },
    short_text: { type: String, required: true },
    text: { type: String, required: true },
    image: { type: String, required: true },
    tags: { type: [String], default: [] },
    category: {
      type: [mongoose.Types.ObjectId],
      ref: "category",
      required: true,
    },
    comments: { type: [CommentSchema], default: [] },
    likes: { type: [mongoose.Types.ObjectId], ref: "user", default: [] },
    dislikes: { type: [mongoose.Types.ObjectId], ref: "user", default: [] },
    bookmarks: { type: [mongoose.Types.ObjectId], ref: "user", default: [] },
    createdAt: { type: Date, default: new Date().getTime() },
  },
  { versionKey: false, toJSON: { virtuals: true } }
);

BlogSchema.virtual("user", {
  ref: "user",
  localField: "author",
  foreignField: "_id",
});

BlogSchema.virtual("category_detail", {
  ref: "category",
  localField: "category",
  foreignField: "_id",
});

BlogSchema.virtual("imageURL").get(function () {
  return `${process.env.BASE_URL}:${process.env.APPLICATION_PORT}/${this.image}`;
});

module.exports = { BlogModel: mongoose.model("blog", BlogSchema) };
