import "reflect-metadata";
import { Resolver, Mutation, Arg, Query, Ctx, UseMiddleware } from "type-graphql";
import userService from "../services/user";
import { MyContext, SignupInput, UserType } from "../library/typeDef";
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

  @Mutation(() => String)
  async signup(
    @Arg("signupInputs") { firstName, lastName, email, password, phoneNumber }: SignupInput
  ): Promise<string> {
    try {
      const user = await userService.signup(firstName, lastName, email, password, phoneNumber);
      if (!user) {
        throw Error();
      } else {
        return "Account created successfuly!";
      }
    } catch (error: any) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }

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
