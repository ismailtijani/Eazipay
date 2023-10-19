import { IsEmail, Length, MinLength } from "class-validator";
import { Request, Response } from "express";
import { Types } from "mongoose";
import { Field, FieldResolver, ID, InputType, Int, ObjectType, Root } from "type-graphql";

@ObjectType()
export class UserType {
  @Field(() => ID)
  _id: Types.ObjectId;

  @Field({ description: "The first name of the user" })
  firstName: string;

  @Field()
  lastName: string;

  // @Field(() => String)
  // fullName(@Root() parent: UserType): string {
  //   return `${parent.firstName} ${parent.lastName}`;
  // }

  @Field()
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
export class SignupInput extends Password implements Partial<UserType> {
  @Field()
  @Length(3, 30, { message: "First name must be greater then 3 characters" })
  firstName: string;

  @Field()
  @Length(1)
  lastName: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  @Length(10)
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
