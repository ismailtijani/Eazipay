export const ClientBaseUrl =
  process.env.NODE_ENV !== "development"
    ? (process.env.PROD_URL as string)
    : "http://localhost:3000";
