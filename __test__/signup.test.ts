// import { app } from "../src/config/app";
// import request from "supertest";
// import { drop_db } from "./db";

// // afterAll(() => {
// //   drop_db();
// // });

// describe("Signup", () => {
//   it("Should sign up a new user", async () => {
//     const signup = `
//     mutation {
//       signup(
//         signupInputs: {
//           firstName: "John",
//           lastName: "Doe",
//           email: "john.doe@example.com",
//           password: "password123",
//           phoneNumber: "1234567890"
//         }
//       )
//     }
//     `;

//     try {
//       const response = await request(app).post("/graphql").send({ query: signup }).expect(200);

//       const responseData = response.body.data;
//       // Check if the signup was successful
//       expect(responseData.signup).toEqual("Account created successfuly!");
//     } catch (error) {
//       throw error;
//     }
//   });
// });

// __tests__/signupResolver.test.ts
import { ApolloServer } from "apollo-server-express";
import { createTestClient } from "apollo-server-testing";
import { gql } from "graphql-tag";
import { app, server } from "../src/config/app"; // Import your Apollo Server instance

const { query, mutate } = createTestClient(new ApolloServer({ schema: server.schema }));

describe("Signup Resolver", () => {
  it("should create a new user", async () => {
    const SIGNUP_MUTATION = gql`
      mutation Signup($input: SignupInput!) {
        signup(signupInputs: $input)
      }
    `;

    const variables = {
      input: {
        firstName: "John",
        lastName: "Doe",
        email: "johndoe@example.com",
        password: "securepassword",
        phoneNumber: "1234567890",
      },
    };

    const { data } = await mutate({
      mutation: SIGNUP_MUTATION,
      variables,
    });

    expect(data).toBeDefined();
    expect(data.signup).toBe("Account created successfully!");
  });
});
