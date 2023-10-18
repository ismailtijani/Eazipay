import { AuthenticationError, MiddlewareFn } from "type-graphql";
import { MyContext } from "../library/typeDef";
import { GraphQLError } from "graphql";

export const Auth: MiddlewareFn<MyContext> = async ({ context }, next) => {
  if (!context.req.session.userId)
    // throw new AuthenticationError("Access denied.Please Authenticate.");
    throw new GraphQLError("Access denied.Please Authenticate.", {
      extensions: { code: "UNAUTHENTICATED" },
    });
  return next();
};
