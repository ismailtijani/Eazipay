import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { LoginInput, MyContext, UserType } from "../../library/typeDef";
import userService from "../../services/user";

@Resolver()
export default class Login {
  @Mutation(() => UserType, { nullable: true })
  async login(
    @Arg("logininputs") { email, password }: LoginInput,
    @Ctx() ctx: MyContext
  ): Promise<UserType | null> {
    const user = await userService.login(email, password);
    ctx.req.session.userId = user._id.toString();
    return user;
  }
}
