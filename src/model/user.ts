import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { UserLevelEnum, AccountStatusEnum } from "../enums";
import { IUser, IUserMethods, UserDocument, UserModel } from "./interface";

const userSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    firstName: {
      type: String,
      required: [true, "First name must be provided"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name must be provided"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
    },
    userLevel: {
      type: String,
      enum: Object.values(UserLevelEnum),
      default: UserLevelEnum.isUser,
    },
    status: {
      type: String,
      enum: Object.values(AccountStatusEnum),
      default: AccountStatusEnum.PENDING,
    },
    confirmationCode: String,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

//Hashing User plain text password before saving
userSchema.pre<UserDocument>("save", async function (next) {
  if (this.isModified("password")) this.password = await bcrypt.hash(this.password, 8);
  next();
});

// Generate and hash password token
userSchema.methods.generateResetPasswordToken = async function () {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString("hex");
  // Hash token and send to resetPassword token field
  this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  // Set expire
  this.resetPasswordExpire = Date.now() + 30 * 60 * 1000;
  await this.save();
  return resetToken;
};

//Removing sensitive datas from the user
userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.confirmationCode;
  return userObject;
};

//Login User Authentication
userSchema.statics.findByCredentials = async (
  email: IUser["email"],
  password: IUser["password"]
) => {
  const user = await User.findOne({ email });
  if (!user) return null;
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) null;
  return user;
};

const User = model<IUser, UserModel>("User", userSchema);

export default User;
