import "reflect-metadata";
import { Resolver, Mutation, Arg, Query, Ctx, Field, UseMiddleware } from "type-graphql";
import userService from "../services/user";
import { MyContext, SignupInput, UserType } from "../typeDef";
import { Auth } from "../middleware/auth";

@Resolver()
export default class userResolver {
  @Query(() => String)
  async home() {
    return "Welcome to Eazipay Application";
  }

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

  @Mutation(() => UserType)
  async signup(
    @Arg("signupInputs") { firstName, lastName, email, password, phoneNumber }: SignupInput
  ): Promise<UserType> {
    try {
      const user = await userService.signup(firstName, lastName, email, password, phoneNumber);
      return user;
    } catch (error: any) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }

  @Mutation(() => UserType, { nullable: true })
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() ctx: MyContext
  ): Promise<UserType | null> {
    try {
      const user = await userService.login(email, password);
      ctx.req.session.userId = user._id.toString();
      return user;
    } catch (error: any) {
      throw new Error(`Failed to login: ${error.message}`);
    }
  }
}
