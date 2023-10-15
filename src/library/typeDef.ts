import { IsEmail, Length, MinLength } from "class-validator";
import { Request, Response } from "express";
import { Types } from "mongoose";
import { Field, ID, InputType, Int, ObjectType } from "type-graphql";

@ObjectType()
export class UserType {
  @Field(() => ID)
  _id: Types.ObjectId;

  @Field({ description: "The first name of the user" })
  firstName: string;

  @Field()
  lastName: string;

  // @Field()
  // fullName(@Root() parent: UserType): string {
  //   return `${parent.firstName} ${parent.lastName}`;
  // }

  @Field()
  @IsEmail()
  email: string;

  @Field(() => Int, { nullable: true })
  phoneNumber: string;

  @Field()
  status: string;

  @Field()
  password: string;
}

@InputType()
class Password {
  @Field()
  @MinLength(8)
  password: string;
}

@InputType()
export class SignupInput extends Password {
  @Field()
  @Length(3, 30, { message: "First name must be greater then 3 characters" })
  firstName: string;

  @Field()
  @Length(1)
  lastName: string;

  @Field()
  @IsEmail()
  email: string;

  @Field({ nullable: true })
  phoneNumber: string;
}

@InputType()
export class LoginInput {
  @Field()
  @IsEmail()
  email: string;

  @Field({ nullable: false })
  password: string;
}

@InputType()
export class ResetPasswordInputs extends Password {
  @Field({ nullable: false })
  token: string;
}

export interface MyContext {
  req: Request;
  res: Response;
}

declare module "express-session" {
  interface Session {
    userId: string;
  }
}
