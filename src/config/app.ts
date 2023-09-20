import express, { Application } from "express";
import "dotenv/config";
import { env } from "process";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import userResolver from "../resolver/userResolver";
import mongoose from "mongoose";
import session from "express-session";
import RedisStore from "connect-redis";
import Redis from "./redis";
import cors from "cors";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";

class Bootstrap {
  public app: Application;
  private server: ApolloServer;
  public mongoUrl =
    env.NODE_ENV === "development"
      ? `mongodb://127.0.0.1/eazipayTest`
      : (env.MONGODB_URL as string);

  constructor() {
    this.app = express();
    this.server = {} as ApolloServer;
    this.mongoSetup();
    this.apolloServer();
    this.expressConfig();
  }

  private expressConfig() {
    this.app.use(express.json());
    this.app.use(
      cors<cors.CorsRequest>({
        origin: ["https://studio.apollographql.com", "http://localhost:3000"],
        credentials: true,
      })
    );

    this.app.use(
      session({
        store: new RedisStore({ client: Redis }),
        name: "sot",
        secret: env.SECRET as string,
        resave: false,
        saveUninitialized: false,
        cookie: {
          httpOnly: true,
          // secure: true,
          maxAge: 60 * 60 * 24 * 7,
          // sameSite: "none",
        },
      })
    );
  }

  private async apolloServer() {
    const schema = await buildSchema({
      resolvers: [userResolver],
    });

    this.server = new ApolloServer({
      schema,
      context: ({ req, res }) => ({ req, res }),
      plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
      // formatError: ArgumentValidationError,
    });
    // Start the Apollo Server
    await this.server.start();
    // Apply middleware to integrate Apollo Server with Express
    this.server.applyMiddleware({ app: this.app });
  }

  private mongoSetup() {
    try {
      mongoose.set("strictQuery", false).connect(this.mongoUrl);
      console.log("DB Connection Successful");
      console.log(`'''''''''''''''''''''''''`);
    } catch (error: any) {
      console.log(error);
      process.exit(1);
    }
  }
}

export const PORT = env.PORT || 4000;
export default new Bootstrap().app;
