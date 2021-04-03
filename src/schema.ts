import { Model } from "./model";
import { ModelReturnProps } from "./SchemaInterfaces";
import { SchemaRef } from "./SchemaRef";

const ModelProperties: string[] = [
  "_save",
  "_id",
  "_modelName",
  "_schema",
  "_doc",
];

export class Schema {
  obj: any;
  SchemaRef: any;
  constructor(doc: any) {
    if (typeof doc !== "object" || Array.isArray(doc))
      throw "enter valid Schema";

    this.obj = doc;
    this.SchemaRef = new SchemaRef(doc).newSchemaRef;
    this.#checkSchema();
  }

  #checkSchema = () => {
    Object.keys(this.obj).forEach((x) => {
      if (ModelProperties.includes(x))
        throw new Error(`can't have property ${x} on Schema`);
    });
  };

  Model(ModelName: string): ModelReturnProps {
    if (typeof ModelName !== "string") throw "enter valid name";
    return new Model(this.obj, ModelName);
  }
}
