import { Query, Resolver } from "type-graphql";

@Resolver()
export default class Home {
  @Query(() => String)
  async home() {
    return "Welcome to Eazipay Application";
  }
}
