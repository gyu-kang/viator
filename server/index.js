const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const cookieParser = require("cookie-parser");
const typeDefs = require("./typeDefs");
const resolvers = require("./resolvers");

const { prisma } = require("./generated/prisma-client/index");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => {
    return {
      db: prisma,
      req,
      res,
    };
  },
});

const app = express();
app.use(cookieParser());
server.applyMiddleware({ app });

app.listen({ port: 4000 }, () => console.log(`Server ready 🚀`));
