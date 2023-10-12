import "reflect-metadata";
import express, { Application } from "express";
import "dotenv/config";
import { env } from "process";
import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { expressMiddleware } from "@apollo/server/express4";
import { buildSchema } from "type-graphql";
import mongoose from "mongoose";
import session from "express-session";
import RedisStore from "connect-redis";
import Redis from "./redis";
import cors from "cors";
import http from "http";
import ResetPassword from "../resolvers/resetPassword";
import Signup from "../resolvers/signup";
import Logout from "../resolvers/logout";
import Login from "../resolvers/login";
import ForgetPassword from "../resolvers/forgetPassword";
import AccountConfrimation from "../resolvers/accountConfirmation";
import Home from "../queries/homepage";
import Profile from "../queries/profile";
import environment from "../environment";

class Bootstrap {
  public app: Application;
  public server: ApolloServer;
  public PORT: number;
  public httpServer: http.Server;

  constructor() {
    this.app = express();
    this.server = {} as ApolloServer;
    const { getDbName, getPort } = new environment();
    this.PORT = getPort();
    this.mongoSetup(getDbName());
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
      // resolvers: [__dirname + "../{queries, resolvers}/**/*.ts"],
    });

    this.server = new ApolloServer({
      schema,
      // context: ({ req, res }) => ({ req, res }),
      plugins: [ApolloServerPluginDrainHttpServer({ httpServer: this.httpServer })],
    });
    // Start the Apollo Server
    await this.server.start();
    this.expressConfig();
  }
  private expressConfig() {
    this.app.use(
      "/",
      express.json(),
      cors<cors.CorsRequest>({
        origin: ["https://studio.apollographql.com", "http://localhost:3000"],
        credentials: true,
      }),

      // Apply middleware to integrate Apollo Server with Express
      expressMiddleware(this.server)
    );
    // this.app.use();
    // this.app.use(
    //   cors<cors.CorsRequest>({
    //     origin: ["https://studio.apollographql.com", "http://localhost:3000"],
    //     credentials: true,
    //   })
    // );

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
  }
  private mongoSetup(url: string) {
    try {
      mongoose.set("strictQuery", false).connect(url);
      console.log("DB Connection Successful");
      console.log(`'''''''''''''''''''''''''`);
    } catch (error: any) {
      console.log(error);
      process.exit(1);
    }
  }
}

export const { server, PORT, httpServer } = new Bootstrap();
