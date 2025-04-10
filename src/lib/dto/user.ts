import { z } from "zod";

const UserUpdateSchema = z.object({
  name: z.string({ required_error: "Name is required"}).min(1).max(50)
});

export { UserUpdateSchema };
