import { Schema } from "./src/schema";
import { MessageModel, MessageSchemaRef } from "./SchemaTest";

const userSchema = new Schema({
  name: true,
  isVerified: false,
  message: new MessageSchemaRef("message", { isArray: false }),
});

const userModel = userSchema.Model("user");

const newUser = new userModel.Model({
  name: "test",
  isVerified: "test",
  message: { text: "test", test: undefined },
});

const test = new MessageModel.Model({ name: "test" });
test._save();

newUser.message.name = "test";
newUser.message.test = { date: "test" };
newUser._save();
