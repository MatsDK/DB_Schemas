import { Schema } from "./src/schema";

const msgSchema = new Schema({ name: true, text: false });

export default {
  Model: msgSchema.Model("msg"),
  SchemaRef: msgSchema.SchemaRef,
};
