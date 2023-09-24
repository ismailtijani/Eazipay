import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { MyContext, UserType } from "../library/typeDef";
import userService from "../services/user";

@Resolver()
export default class Login {
  @Mutation(() => UserType, { nullable: true })
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() ctx: MyContext
  ): Promise<UserType | null> {
    const user = await userService.login(email, password);
    ctx.req.session.userId = user._id.toString();
    return user;
  }
}
