import { Schema } from "./src/schema";
import { MessageSchemaRef } from "./SchemaTest";

const userSchema = new Schema({
  name: true,
  isVerified: false,
  message: new MessageSchemaRef("message", { isArray: false }),
});

const userModel = userSchema.Model("user");

const newUser = new userModel.Model({
  name: "value",
  isVerified: "value",
  message: { text: "value", test: undefined },
});

// const test = new MessageModel.Model({ name: "tesvaluet" });
// test._save();

newUser.message.name = "value";
newUser.message.test = { date: "value" };
newUser._save();
