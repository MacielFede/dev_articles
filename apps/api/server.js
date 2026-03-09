const express = require("express");
const { createHandler } = require("graphql-http/lib/use/express");
const { schema, rootValue } = require("./schema");
const cors = require("cors");

const app = express();

app.use(cors());

app.use(
  "/graphql",
  createHandler({
    schema,
    rootValue,
  })
);

app.listen(4000, () => {
  console.log("GraphQL API running at http://localhost:4000/graphql");
});
