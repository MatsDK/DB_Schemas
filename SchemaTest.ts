import { Schema } from "./src/schema";

const testSchema = new Schema({
  date: { defaultValue: "test" },
  test: { defaultValue: "test" },
  text: { defaultValue: "test" },
  title: { defaultValue: "test" },
  email: { defaultValue: "test" },
});

const msgSchema = new Schema({
  name: true,
  text: false,
  test: new testSchema.SchemaRef("test", { isArray: false }),
});

export const MessageModel = msgSchema.Model("message");
export const MessageSchemaRef = msgSchema.SchemaRef;
