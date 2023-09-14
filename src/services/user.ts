import crypto from "crypto";
import { AccountStatusEnum } from "../enums";
import User from "../model/user";

export default class userService {
  static signup = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    phoneNumber: string
  ) => {
    try {
      //Check if there is a registered account with the email
      const existingUser = await User.findOne({ email });

      if (existingUser && existingUser.status === AccountStatusEnum.PENDING) {
        throw new Error("An Account Already Exist with this details, kindly verify your account");
      } else if (existingUser && existingUser.status === AccountStatusEnum.ACTIVATED) {
        throw new Error("User alredy exist, Kindly login");
      }
      //Create User account
      const user = await User.create({ firstName, lastName, email, phoneNumber, password });
      //Generate auth token
      const token = crypto.randomBytes(20).toString("hex");
      user.confirmationCode = token;
      await user.save();
      // Send Confirmation Message to new user
      //   MailService.sendAccountActivationCode({ email, token });
      return user;
    } catch (error) {
      throw error;
    }
  };

  static login = async (email: string, password: string) => {
    try {
      const user = await User.findByCredentials(email, password);
      return user;
    } catch (error) {
      throw error;
    }
  };

  static async userProfile(id: any) {
    const user = await User.findOne(id);
    return user;
  }
}
