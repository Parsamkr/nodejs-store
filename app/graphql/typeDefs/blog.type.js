const { GraphQLObjectType, GraphQLString, GraphQLList } = require("graphql");
const { DateType, AuthorType, CategoryType } = require("./public.types");

const BlogType = new GraphQLObjectType({
  name: "BlogType",
  fields: {
    _id: { type: GraphQLString },
    author: { type: AuthorType },
    title: { type: GraphQLString },
    short_text: { type: GraphQLString },
    text: { type: GraphQLString },
    image: { type: GraphQLString },
    imageURL: { type: GraphQLString },
    tags: { type: new GraphQLList(GraphQLString) },
    category: {
      type: CategoryType,
    },

    createdAt: { type: DateType },
  },
});

module.exports = { BlogType };
