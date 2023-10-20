import "reflect-metadata";
import express, { Application } from "express";
import mongoose from "mongoose";
import "dotenv/config";
import { env } from "process";
import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { expressMiddleware } from "@apollo/server/express4";
import { buildSchema } from "type-graphql";
import session from "express-session";
import RedisStore from "connect-redis";
import Redis from "./redis";
import cors from "cors";
import http from "http";
import ResetPassword from "../resolvers/mutations/resetPassword";
import Signup from "../resolvers/mutations/signup";
import Logout from "../resolvers/mutations/logout";
import Login from "../resolvers/mutations/login";
import ForgetPassword from "../resolvers/mutations/forgetPassword";
import AccountConfrimation from "../resolvers/mutations/accountConfirmation";
import Home from "../resolvers/queries/homepage";
import Profile from "../resolvers/queries/profile";
import customError from "../library/errorHandler";
import Environment from "../environment";
class Bootstrap {
  public app: Application;
  public server: ApolloServer;
  public httpServer: http.Server;

  constructor() {
    this.app = express();
    this.server = {} as ApolloServer;
    this.mongoSetup();
    this.httpServer = http.createServer(this.app);
    this.apolloServer();
  }

  private async apolloServer() {
    const schema = await buildSchema({
      resolvers: [
        Home,
        Signup,
        Login,
        Profile,
        Logout,
        ResetPassword,
        ForgetPassword,
        AccountConfrimation,
      ],
      validate: true,
      // resolvers: [__dirname + "../{queries, resolvers}/**/*.ts"],
    });

    this.server = new ApolloServer({
      schema,
      plugins: [ApolloServerPluginDrainHttpServer({ httpServer: this.httpServer })],
      status400ForVariableCoercionErrors: true, //It's not working, the status is still 200
      includeStacktraceInErrorResponses: true,
      formatError: customError,
    });
    // Start the Apollo Server
    await this.server.start();
    this.expressConfig();
  }
  private expressConfig() {
    this.app.use(
      session({
        store: new RedisStore({ client: Redis }),
        name: "authToken",
        secret: env.SECRET as string,
        resave: false,
        saveUninitialized: false,
        cookie: {
          httpOnly: true,
          secure: env.NODE_ENV === "production",
          maxAge: 60 * 60 * 24 * 7,
          // sameSite: "none",
        },
      })
    );
    this.app.use(
      "/",
      express.json(),
      cors<cors.CorsRequest>({
        origin: ["http://localhost:3000"],
        credentials: true,
      }),
      // Apply middleware to integrate Apollo Server with Express
      expressMiddleware(this.server, { context: async ({ req, res }) => ({ req, res }) })
    );
  }
  private async mongoSetup() {
    try {
      await mongoose.set("strictQuery", false).connect(Environment.getDbName());
      console.log("DB Connection Successful");
      console.log(`'''''''''''''''''''''''''`);
    } catch (error) {
      console.log("DB Connection Error", error);
      process.exit(1);
    }
  }
}

export const PORT = Environment.getPort();

export const { server, app, httpServer } = new Bootstrap();
