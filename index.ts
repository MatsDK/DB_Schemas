import { Schema } from "./src/schema";
import { MessageSchemaRef } from "./SchemaTest";

const userSchema = new Schema({
  verified: { defaultValue: false },
  name: { defaultValue: "test1" },
  messages: new MessageSchemaRef("messsageRef", { isArray: true }),
});

const userModel = userSchema.Model("user0");

const newUser = new userModel.Model({
  name: "testName",
  verified: true,
  messages: [{ text: "testText", name: "newName", test: [{ date: "test" }] }],
});

// const test = new MessageModel.Model({ name: "value" });
// test._save();

// userModel.findOne();
// userModel.find();
console.log(newUser);

// newUser.messages.name = "value";
// newUser.messages.test = { date: "value" };
// newUser._save((res: any) => console.log(res));
