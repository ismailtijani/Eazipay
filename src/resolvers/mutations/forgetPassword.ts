import { Arg, Mutation, Resolver } from "type-graphql";
import userService from "../../services/user";

@Resolver()
export default class ForgetPassword {
  @Mutation(() => String)
  async forgetPassword(@Arg("email") email: string): Promise<string> {
    return await userService.forgetPassword(email);
  }
}
