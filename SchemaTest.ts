import { Schema } from "./src/schema";

const testSchema = new Schema({
  password: { required: true },
  email: { defaultValue: "test" },
});

const msgSchema = new Schema({
  name: { defaultValue: "" },
  details: new testSchema.SchemaRef("test", { isArray: false }),
});

export const MessageModel = msgSchema.Model("message");
export const MessageSchemaRef = msgSchema.SchemaRef;
