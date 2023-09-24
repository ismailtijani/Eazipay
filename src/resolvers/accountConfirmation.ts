import { Arg, Mutation, Resolver } from "type-graphql";
import userService from "../services/user";

@Resolver()
export default class AccountConfrimation {
  @Mutation(() => String)
  async confirmAccount(@Arg("confirmationCode") confirmationCode: string): Promise<string> {
    try {
      const confrimed = await userService.confirmAccount(confirmationCode);
      if (!confrimed) {
        return "Invalid or Expired confirmation code";
      } else return "Account Activation was successful";
    } catch (error: any) {
      throw Error(`Account confirmation failed: ${error.message}`);
    }
  }
}
