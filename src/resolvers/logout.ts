import { Ctx, Mutation, Resolver } from "type-graphql";
import userService from "../services/user";
import { MyContext } from "../library/typeDef";

@Resolver()
export default class Logout {
  @Mutation(() => String)
  async logout(@Ctx() ctx: MyContext): Promise<string> {
    const res = await userService.logout(ctx);
    if (!res) return "Error occured, please try again";
    return "You have successfully logged out of this system";
  }
}
