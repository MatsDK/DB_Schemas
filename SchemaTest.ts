import { Schema } from "./src/schema";

const testSchema = new Schema({
  date: true,
  test: false,
  text: true,
  title: true,
  email: true,
});

const msgSchema = new Schema({
  name: true,
  text: false,
  test: new testSchema.SchemaRef("test", { isArray: false }),
});

export const MessageModel = msgSchema.Model("message");
export const MessageSchemaRef = msgSchema.SchemaRef;
