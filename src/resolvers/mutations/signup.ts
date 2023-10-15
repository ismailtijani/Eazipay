import { Arg, Mutation, Resolver } from "type-graphql";
import userService from "../../services/user";
import { SignupInput } from "../../library/typeDef";

@Resolver()
export default class Signup {
  @Mutation(() => String)
  async signup(
    @Arg("signupInputs") { firstName, lastName, email, password, phoneNumber }: SignupInput
  ): Promise<string> {
    return await userService.signup(firstName, lastName, email, password, phoneNumber);
  }
}
