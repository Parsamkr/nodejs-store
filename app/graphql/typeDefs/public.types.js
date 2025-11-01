const {
  GraphQLScalarType,
  GraphQLObjectType,
  GraphQLString,
} = require("graphql");
const { Kind } = require("graphql/language");
const { parseLiteral, toObject } = require("../utils");

const AnyType = new GraphQLScalarType({
  name: "AnyType",
  parseValue: toObject,
  serialize: toObject,
  parseLiteral: parseLiteral,
});

const DateType = new GraphQLScalarType({
  name: "Date",
  description: "Date custom scalar type",
  serialize(value) {
    return value.toISOString(); // Convert outgoing Date to ISO String
  },
  parseValue(value) {
    return new Date(value); // Convert incoming ISO String to Date
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value); // Convert AST literal to Date
    }
    return null;
  },
});

const AuthorType = new GraphQLObjectType({
  name: "AuthorType",
  fields: {
    _id: { type: GraphQLString },
    first_name: { type: GraphQLString },
    last_name: { type: GraphQLString },
  },
});

const PublicCategoryType = new GraphQLObjectType({
  name: "PublicCategoryType",
  fields: {
    _id: { type: GraphQLString },
    title: { type: GraphQLString },
  },
});

module.exports = { DateType, AuthorType, PublicCategoryType, AnyType };
