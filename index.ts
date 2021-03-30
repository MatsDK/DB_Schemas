import { Schema } from "./src/schema";
import msgSchema from "./SchemaTest";

const userSchema = new Schema({
  name: true,
  isVerified: false,
  message: new msgSchema.SchemaRef("message", { isArray: false }),
});

const { Model: userModel } = userSchema.Model("user");

const newUser = new userModel({
  name: "test",
  isVerified: "test",
  message: { name: "test" },
});

console.log(newUser.doc);
