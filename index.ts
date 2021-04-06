import { Schema } from "./src/schema";
import { MessageSchemaRef } from "./SchemaTest";

const userSchema = new Schema({
  verified: {
    isVerified: { defaultValue: false, required: true },
  },
  name: { defaultValue: "test1" },
  messages: new MessageSchemaRef("messsageRef", { isArray: true }),
});

const userModel = userSchema.Model("user21");

userModel.update(
  { verified: { isVerified: true } },
  { name: "test2121212121", verified: { isVerified: false } },
  (res: any, err: any) => {
    console.log(res, err);
  }
);

// userModel.findOne(
//   { verified: { isVerified: false } },
//   (rows: any[], err: any) => {
//     console.log(rows, rows.length);
//   }
// );

// const newUser = new userModel.Model({
//   name: "test12",
//   verified: { isVerified: true },
//   messages: [
//     { name: "newName", details: { email: "test", password: "anypassword" } },
//   ],
// });

// const test = new MessageModel.Model({ name: "value" });
// test._save();

// userModel.findOne();
// userModel.find();

// newUser.messages[0].name1 = "value";

// newUser._save((res: any, err: any) => {
//   console.log(res, err);
// });
