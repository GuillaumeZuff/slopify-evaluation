import { ApolloServer } from "@apollo/server";
import { WebApp } from "meteor/webapp";
import { getUser } from "meteor/apollo";
import typeDefs from "./schema";
import { resolvers } from "./resolvers";
import express from "express";
import { expressMiddleware } from "@apollo/server/express4";
import { json } from "body-parser";

const context = async ({ req }) => {
  return {
    user: await getUser(req.headers.authorization),
  };
};

const server = new ApolloServer({
  cache: "bounded",
  typeDefs,
  resolvers,
});

export async function startApolloServer() {
  await server.start();

  WebApp.connectHandlers.use(
    "/graphql", // Configure the path as you want.
    express() // Create new Express router.
      .disable("etag") // We don't server GET requests, so there's no need for that.
      .disable("x-powered-by") // A small safety measure.
      .use(json()) // From `body-parser`.
      .use(expressMiddleware(server, { context })), // From `@apollo/server/express4`.
  );
}
