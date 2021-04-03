import { Schema } from "./src/schema";
import { MessageSchemaRef } from "./SchemaTest";

const userSchema = new Schema({
  // name: {
  //   test: { defaultValue: "test" },
  //   matsdekort: { defaultValue: "test" },
  //   fdasfsa: {
  //     fasdfdas: { defaultValue: "test" },
  //     test2: { defaultValue: "test" },
  //   },
  // },
  isVerified: { defaultValue: "test" },
  message: new MessageSchemaRef("test", { isArray: false }),
});

const userModel = userSchema.Model("user0");

const newUser = new userModel.Model({
  // name: {
  //   test: "fsadf",
  //   fdasfsa: { fasdfdas: "fdsa" },
  // },
  isVerified: {},
  message: { text: "value", test: undefined },
});

// const test = new MessageModel.Model({ name: "value" });
// test._save();

// userModel.findOne();
// userModel.find();

// process.env.foo = "testvar";

// console.log(process.env.foo);

newUser.message.name = "value";
newUser.message.test = { date: "value" };
newUser._save((res: any) => console.log(res));
