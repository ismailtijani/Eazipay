import { Arg, Mutation, Resolver } from "type-graphql";
import userService from "../../services/user";

@Resolver()
export default class AccountConfrimation {
  @Mutation(() => String)
  async confirmAccount(@Arg("confirmationCode") confirmationCode: string): Promise<string> {
    return await userService.confirmAccount(confirmationCode);
  }
}
