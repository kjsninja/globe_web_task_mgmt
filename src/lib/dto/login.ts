import { z } from "zod";

const UserLoginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Invalid email address" }),
  password: z.string({ required_error: "Password is required" }).max(30),
});

const UserSignUpSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Invalid email address" }),
  password: z.string({ required_error: "Password is required" }).max(30),
  name: z.string({ required_error: "Name is required"}).min(1).max(50)
});

export { UserLoginSchema, UserSignUpSchema };
