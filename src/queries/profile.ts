import { Ctx, Query, Resolver, UseMiddleware } from "type-graphql";
import { MyContext, UserType } from "../library/typeDef";
import userService from "../services/user";
import { Auth } from "../middleware/auth";

@Resolver()
export default class Profile {
  @Query(() => UserType, { nullable: true })
  @UseMiddleware(Auth)
  async profile(@Ctx() ctx: MyContext): Promise<UserType | null> {
    try {
      const user = await userService.userProfile(ctx.req.session.userId);
      return user;
    } catch (error) {
      throw new Error("Error fetching data");
    }
  }
}
