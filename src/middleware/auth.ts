import { MiddlewareFn } from "type-graphql";
import { MyContext } from "../typeDef";

export const Auth: MiddlewareFn<MyContext> = async ({ context }, next) => {
  if (!context.req.session.userId) throw new Error("Access denied.Please Authenticate.");
  return next();
};
