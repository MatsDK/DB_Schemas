import { Schema } from "./src/schema";
import { MessageSchemaRef } from "./SchemaTest";

const userSchema = new Schema({
  name: {
    test: true,
    matsdekort: false,
    fdasfsa: { fasdfdas: false, test2: false },
  },
  isVerified: false,
  message: new MessageSchemaRef("test", { isArray: false }),
});

const userModel = userSchema.Model("user0");

const newUser = new userModel.Model({
  name: {
    test: "fsadf",
    fdasfsa: { fasdfdas: "fdsa" },
  },
  isVerified: "value",
  message: { text: "value", test: undefined },
});

// const test = new MessageModel.Model({ name: "value" });
// test._save();

// userModel.findOne();

newUser.message.name = "value";
newUser.message.test = { date: "value" };
newUser._save();
