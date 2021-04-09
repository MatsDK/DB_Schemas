import { Schema } from "./src/schema";
import { MessageSchemaRef } from "./SchemaTest";

const userSchema = new Schema({
  name: { type: "string" },
  messages: [
    {
      text: {
        name: { defaultValue: "empty", type: "string" },
        age: { type: "number", required: true },
      },
    },
  ],
  messages1: new MessageSchemaRef("messsageRef", { isArray: true }),
});

const userModel = userSchema.Model("newUserModel");

// userModel.findAndUpdate(
//   { _id: "YBrHsPhlMERrRQTZcMK5d" },
//   { name: "test21212121212121" },
//   (updatedData: any[], err: any) => {
//     console.log(updatedData, err);
//   }
// );

userModel.find((rows: any[], err: any) => {
  if (err) throw err;

  rows[0].name = "newName";
  console.log(
    rows[0]._save((res: any, err: any) => {
      console.log(res, err);
    })
  );
  // rows.forEach((row: any) => {
  //   row._save();
  // });
});

// userModel.findOne(
//   { verified: { isVerified: false } },
//   (rows: any[], err: any) => {
//     console.log(rows, rows.length);
//   }
// );

// const newUser = new userModel.Model({
//   name: "newUserName",
//   messages: [{ text: { name: "testName", age: 21 } }],
//   messages1: [{ name: true }],
// });

// console.log(newUser);

// newUser._save((res: any, err: any) => {
//   console.log(res, err);
// });
