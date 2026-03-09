const express = require("express");
const { createHandler } = require("graphql-http/lib/use/express");
const { schema, rootValue } = require("./schema");
const cors = require("cors");

const app = express();

app.use(cors());

// Basic request logging for every backend interaction
app.use((req, res, next) => {
  const start = Date.now();
  console.log(
    `[HTTP] ${req.method} ${req.originalUrl} from ${req.ip} at ${new Date().toISOString()}`
  );

  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(
      `[HTTP] ${req.method} ${req.originalUrl} -> ${res.statusCode} in ${duration}ms`
    );
  });

  next();
});

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

