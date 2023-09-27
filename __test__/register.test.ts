import { connect_db, drop_db } from "./db";
import { server } from "../src/config/app";
// import { gql } from "apollo-server-express";

beforeAll(async () => await connect_db());
afterAll(async () => await drop_db());

it("Homepage", async () => {
  let result = server.executeOperation({
    query: `
      query {
        home
      }
    `,
  });
  expect(result).toBeTruthy();
  expect(result).toBe(String);
});
