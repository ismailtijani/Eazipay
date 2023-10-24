import { app } from "../src/config/app";
import request from "supertest";

describe("Login", () => {
  it("Login user successfully", async () => {
    const login = `
    mutation{
        login(email:"john.doe@example.com",password:"password123"){
            user{
                _id
                firstName
                lastName
            }
        }
    }
    `;

    try {
      const response = await request(app).post("/graphql").send({ query: login }).expect(200);
      const data = response.body.data;
      // console.log(response.body.errors);
      // console.log(data);
      expect(data.user).toBeTruthy();
      // expect(response).toHaveProperty("data");
      // expect(response.body.errors).toBeFalsy();
      expect(data.user).toMatchObject({ _id: "1234", firstName: "John", lastName: "Doe" });
    } catch (error) {
      console.log(error);
      throw error;
    }
  });
});
