import { IsEmail, Length } from "class-validator";
import { Request } from "express";
import { Types } from "mongoose";
import { Field, InputType, ObjectType } from "type-graphql";

@ObjectType()
export class UserType {
  @Field(() => String)
  _id: Types.ObjectId;

  @Field()
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

  @Field()
  phoneNumber: string;

  @Field()
  status: string;

  @Field()
  password: string;
}

@InputType()
export class SignupInput {
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

  @Field()
  password: string;
}

@InputType()
export class LoginInput {
  @Field()
  email: string;

  @Field()
  password: string;
}

export interface MyContext {
  req: Request;
}

declare module "express-session" {
  interface Session {
    userId: string;
  }
}
