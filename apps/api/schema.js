const { buildSchema } = require("graphql");
const resolvers = require("./resolvers");

const schema = buildSchema(`
  type Article {
    id: ID
    title: String
    content: String
  }

  type Query {
    articles(search: String): [Article]
    article(id: ID!): Article
  }
`);

module.exports = {
  schema,
  rootValue: resolvers,
};
