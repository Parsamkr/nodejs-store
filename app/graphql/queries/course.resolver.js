const { GraphQLList } = require("graphql");
const { BlogType } = require("../typeDefs/blog.type");
const { BlogModel } = require("../../models/blogs");

const BlogResolver = {
  type: new GraphQLList(BlogType),
  resolve: async () => {
    return await BlogModel.find({}).populate([
      { path: "author" },
      { path: "category" },
    ]);
  },
};

module.exports = { BlogResolver };
