import { ApolloServerErrorCode } from "@apollo/server/errors";
import { GraphQLFormattedError } from "graphql";

export default (formattedError: GraphQLFormattedError, error: unknown) => {
  // Return a different error message
  if (
    formattedError.extensions?.code === ApolloServerErrorCode.BAD_USER_INPUT ||
    formattedError.extensions?.code === ApolloServerErrorCode.GRAPHQL_VALIDATION_FAILED
  ) {
    return {
      message: formattedError.message,
      extensions: formattedError.extensions,
    };
  }
  return formattedError;
};
