import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db(process.env.DB_NAME || "fixmate");

export const auth = betterAuth({
  database: mongodbAdapter(db),

  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,

  trustedOrigins: [
    "http://localhost:3000",
    "http://127.0.0.1:3000"
  ],

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8
  },

  user: {
    modelName: "users",
    additionalFields: {
      role: {
        type: ["customer", "technician"],
        required: false,
        defaultValue: "customer",
        input: true
      },
      phone: {
        type: "string",
        required: false,
        input: true
      },
      area: {
        type: "string",
        required: false,
        input: true
      },
      bio: {
        type: "string",
        required: false,
        input: true
      }
    }
  },

  plugins: [jwt()]
});
