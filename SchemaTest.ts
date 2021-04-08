import { Schema } from "./src/schema";

const msgSchema = new Schema({
  name: { defaultValue: false, type: "boolean" },
});

export const MessageModel = msgSchema.Model("message");
export const MessageSchemaRef = msgSchema.SchemaRef;
