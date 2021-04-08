import { Schema } from "./src/schema";
import { MessageSchemaRef } from "./SchemaTest";

const userSchema = new Schema({
  name: { defaultValue: "jfdksal", type: "string" },
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

const userModel = userSchema.Model("user2");

// userModel.findAndUpdate(
//   { age: 21 },
//   {
//     age: 22,
//     name: "test21212121212121",
//   },
//   (updatedData: any[], err: any) => {
//     console.log(updatedData[0], err);
//   }
// );

// userModel.find((rows, err) => {
//   if (err) throw err;

//   console.log(rows);
//   // rows.forEach((row: any) => {
//   //   row._save();
//   // });
// });

// userModel.findOne(
//   { verified: { isVerified: false } },
//   (rows: any[], err: any) => {
//     console.log(rows, rows.length);
//   }
// );

const newUser = new userModel.Model({
  name: "",
  messages: [{ text: { name: "testName", age: 21 } }],
  messages1: [{ name: true }],
});

console.log(newUser);

newUser._save((res: any, err: any) => {
  console.log(res, err);
});
