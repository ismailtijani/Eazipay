import { Resolver, Mutation, Arg } from "type-graphql";
import userService from "../../services/user";
import { ResetPasswordInputs } from "../../library/typeDef";

@Resolver()
export default class ResetPassword {
  @Mutation(() => String)
  async resetPassword(@Arg("data") { token, password }: ResetPasswordInputs): Promise<string> {
    return await userService.resetPassword(token, password);
  }
}
