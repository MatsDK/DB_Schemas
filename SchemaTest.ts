import { Schema } from "./src/schema";

const testSchema = new Schema({
  date: { defaultValue: "test1" },
  test: { defaultValue: "test" },
  text2: {},
  title: { defaultValue: "test1" },
  email: { defaultValue: "test" },
});

const msgSchema = new Schema({
  name1: {},
  text: { defaultValue: "uyoknow" },
  test: new testSchema.SchemaRef("test", { isArray: false }),
});

export const MessageModel = msgSchema.Model("message");
export const MessageSchemaRef = msgSchema.SchemaRef;
