const { default: mongoose } = require("mongoose");

const Schema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    parent: {
      type: mongoose.Types.ObjectId,
      ref: "category",
      default: undefined,
    },
    createdAt: { type: Date, default: new Date().getTime() },
  },
  { id: false, versionKey: false, toJSON: { virtuals: true } }
);

Schema.virtual("children", {
  ref: "category",
  localField: "_id",
  foreignField: "parent",
});

// bakhshe paiin age jaii nkhaim children o bgirim bazam mide be ma

// function autoPopulate(next) {
//   this.populate([{ path: "children", select: { __v: 0 } }]);
//   next();
// }

//  Schema.pre("findOne", autoPopulate).pre("find", autoPopulate);

module.exports = { CategoryModel: mongoose.model("category", Schema) };
