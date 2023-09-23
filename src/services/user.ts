import crypto from "crypto";
import { AccountStatusEnum } from "../library/enums";
import User from "../model/user";
import MailService from "../Email/service";
import { MyContext } from "../library/typeDef";
import { ApolloError } from "apollo-server-express";

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
      const existingUser = await User.findOne({ email }).lean();

      if (existingUser && existingUser.status === AccountStatusEnum.PENDING) {
        throw new ApolloError(
          "An Account Already Exist with this details, kindly verify your account"
        );
      } else if (existingUser && existingUser.status === AccountStatusEnum.ACTIVATED) {
        throw new ApolloError("User alredy exist, Kindly login");
      }
      //Create User account
      const user = await User.create({ firstName, lastName, email, phoneNumber, password });
      //Generate auth token
      const token = crypto.randomBytes(20).toString("hex");
      user.confirmationCode = token;
      await user.save();
      // Send Confirmation Message to new user
      const response = await MailService.sendAccountActivationCode({ email, token });
      return response;
    } catch (error) {
      throw error;
    }
  };

  static confirmAccount = async (confirmationCode: string) => {
    try {
      const user = await User.findOne({ confirmationCode });
      if (!user) return false;

      const updateData = { status: AccountStatusEnum.ACTIVATED, confirmationCode: null };
      await User.findOneAndUpdate({ _id: user._id }, updateData, {
        new: true,
        runValidators: true,
      });
      //Send Account confirmation Success mail
      await MailService.sendAccountSuccessEmail({ email: user.email });

      return true;
    } catch (error) {
      throw Error("An error occured while trying to confirm your account, Please try agin later");
    }
  };

  static login = async (email: string, password: string) => {
    const user = await User.findByCredentials(email, password);
    return user;
  };

  static async userProfile(id: any) {
    const user = await User.findById(id);
    return user;
  }

  static logout(ctx: MyContext): Promise<boolean> {
    return new Promise((resolve, reject) =>
      ctx.req.session.destroy((error) => {
        if (error) {
          console.log(error);
          return reject(false);
        }

        ctx.res.clearCookie("sot");
        return resolve(true);
      })
    );
  }

  static async forgetPassword(email: string) {
    try {
      // Search for user Account
      const user = await User.findOne({ email });
      if (!user) throw new Error("Sorry, we don't recognize this account");
      //Generate reset Password Token
      const resetToken = await user.generateResetPasswordToken();
      await MailService.sendPasswordReset({ name: user.firstName, email, token: resetToken });
    } catch (error) {
      throw error;
    }
  }

  static async resetPassword(token: string, password: string) {
    // Hash token
    const resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");

    try {
      const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
      });

      if (!user) throw new Error("Invalid or Expired Token");
      // Set new password
      user.password = password;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save();
    } catch (error) {
      throw error;
    }
  }
}
