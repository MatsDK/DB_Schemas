import { Schema } from "./src/schema";
import msgSchema from "./SchemaTest";

const userSchema = new Schema({
  name: true,
  isVerified: false,
  message: new msgSchema.SchemaRef("message", { isArray: false }),
});

const { Model: userModel, ...userModelFuncs } = userSchema.Model("user");

const newUser = new userModel({
  name: "test",
  isVerified: "test",
  message: { text: "test211221212121", test: undefined },
});

newUser.message.name = "mate";
newUser.message.test = { date: "test" };
newUser._save();
