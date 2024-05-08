const { default: mongoose } = require("mongoose");
const { CommentSchema } = require("./public.shema");
const { getTimeOfCourse } = require("../utils/functions");

const Episode = new mongoose.Schema(
  {
    title: { type: String, required: true },
    text: { type: String, required: true },
    type: { type: String, default: "unlock" },
    time: { type: String, required: "true" },
    videoAddress: { type: String, required: true },
  },
  { versionKey: false, toJSON: { virtuals: true } }
);

Episode.virtual("videoURL").get(function () {
  return `${process.env.BASE_URL}:${process.env.APPLICATION_PORT}/${this.videoAddress}`;
});

const Chapter = new mongoose.Schema(
  {
    title: { type: String, required: true },
    text: { type: String, required: true },
    episodes: { type: [Episode], default: [] },
  },
  { versionKey: false, toJSON: { virtuals: true } }
);

const CourseSchema = new mongoose.Schema(
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
    status: { type: String, default: "notStarted" }, //notStarted ,Completed ,Holding
    teacher: { type: mongoose.Types.ObjectId, ref: "user", required: true },
    chapters: { type: [Chapter], default: [] },
    students: { type: [mongoose.Types.ObjectId], default: [], ref: "user" },
  },
  { versionKey: false, toJSON: { virtuals: true } }
);

CourseSchema.index({ title: 1, short_text: 1, text: 1 });

CourseSchema.virtual("imageURL").get(function () {
  return `${process.env.BASE_URL}:${process.env.APPLICATION_PORT}/${this.image}`;
});
CourseSchema.virtual("totalTime").get(function () {
  return getTimeOfCourse(this.chapters || []);
});

module.exports = { CourseModel: mongoose.model("course", CourseSchema) };
