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

export default {
  Model: msgSchema.Model("message").Model,
  SchemaRef: msgSchema.SchemaRef,
};
