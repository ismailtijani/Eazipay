import { Arg, Mutation, Resolver } from "type-graphql";
import userService from "../services/user";

@Resolver()
export default class ForgetPassword {
  @Mutation(() => String)
  async forgetPassword(@Arg("email") email: string): Promise<string> {
    try {
      await userService.forgetPassword(email);
      return "Reset password link has been sent to your Email✅";
    } catch (error: any) {
      throw new Error(`An error occured: ${error.message}`);
    }
  }
}
