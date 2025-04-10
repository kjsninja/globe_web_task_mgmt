import { z } from "zod";

const NewTaskSchema = z.object({
  title: z.string({ required_error: "Title is required" }).trim().min(1).max(50),
  content: z.string({ required_error: "Content is required" }).trim().min(1).max(500)
});

export { NewTaskSchema };
