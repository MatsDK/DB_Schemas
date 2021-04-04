import { Schema } from "./src/schema";
import { MessageSchemaRef } from "./SchemaTest";

const userSchema = new Schema({
  verified: { defaultValue: false },
  name: { defaultValue: "test1" },
  messages: new MessageSchemaRef("messsageRef", { isArray: true }),
});

const userModel = userSchema.Model("user1");

userModel.find(
  { name: "test" },
  { skip: 5, limit: 5 },
  (res: any, err: any) => {
    console.log(res, err);
  }
);

// const newUser = new userModel.Model({
//   verified: true,
//   messages: [{ text: "testText", name1: "newName", test: { date: "test" } }],
// });

// // const test = new MessageModel.Model({ name: "value" });
// // test._save();

// // userModel.findOne();
// // userModel.find();

// newUser.messages[0].name1 = "value";

// newUser._save((res: any, err: any) => {
//   console.log(res, err);
// });
