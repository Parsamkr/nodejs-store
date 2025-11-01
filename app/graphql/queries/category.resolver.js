const { GraphQLList, GraphQLString } = require("graphql");
const { CategoryModel } = require("../../models/categories");
const { CategoryType } = require("../typeDefs/category.type");

const CategoryResolver = {
  type: new GraphQLList(CategoryType),
  args: {
    field: { type: GraphQLString },
  },
  resolve: async () => {
    return await CategoryModel.find({ parent: undefined }).populate([
      { path: "children" },
    ]);
  },
};

const CategoryChildResolver = {
  type: new GraphQLList(CategoryType),
  args: {
    parent: { type: GraphQLString },
  },
  resolve: async (_, args) => {
    const { parent } = args;
    return await CategoryModel.find({ parent }).populate([
      { path: "children" },
    ]);
  },
};

module.exports = { CategoryResolver, CategoryChildResolver };
