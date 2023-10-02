import { env } from "process";

export default class Environment {
  public mongoUrl: string;
  public PORT: number;
  getPort() {
    if (env.NODE_ENV === "test") {
      return parseInt(env.TEST_PORT as string);
    } else if (env.NODE_ENV === "production") {
      return parseInt(env.PORT as string);
    } else return 8000;
  }

  getDbName() {
    if (env.NODE_ENV === "test") {
      return `mongodb://127.0.0.1/${env.MONGODB_URL_TEST as string}`;
    } else if (env.NODE_ENV === "production") {
      return env.MONGODB_URL as string;
    } else return `mongodb://127.0.0.1/eazipayDev`;
  }
}
// export const { getDbName, getPort } = new Environment();
