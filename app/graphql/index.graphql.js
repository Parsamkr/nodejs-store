const { GraphQLObjectType, GraphQLSchema } = require("graphql");
const { BlogResolver } = require("./queries/blog.resolver");
// query , mutation , schema , types

const RootQuery = new GraphQLObjectType({
  name: "RootQuery",
  fields: {
    blogs: BlogResolver,
  },
});

const RootMutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {},
});

const graphQLSchema = new GraphQLSchema({
  query: RootQuery,
  // mutation: RootMutation,
});

module.exports = { graphQLSchema };
