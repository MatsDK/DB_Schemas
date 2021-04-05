import { Schema } from "./src/schema";
import { MessageSchemaRef } from "./SchemaTest";

const userSchema = new Schema({
  verified: {
    isVerified: { defaultValue: false, required: true },
  },
  name: { defaultValue: "test1" },
  messages: new MessageSchemaRef("messsageRef", { isArray: true }),
});

const userModel = userSchema.Model("user1");

userModel.find({ skip: 3, limit: 10 }, (res: any, err: any) => {
  console.log(res, res.length, err);
});

// const newUser = new userModel.Model({
//   verified: { isVerified: undefined },
//   messages: [{ name: "newName", details: { email: "test" } }],
// });

// const test = new MessageModel.Model({ name: "value" });
// test._save();

// userModel.findOne();
// userModel.find();

// newUser.messages[0].name1 = "value";

// newUser._save((res: any, err: any) => {
//   console.log(res, err);
// });
