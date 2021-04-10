import { Model } from "./model";
import { ModelReturnProps } from "./SchemaInterfaces";
import { SchemaRef } from "./SchemaRef";
import { checkSchemaOptions } from "./utils/checkSchema";

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
    const checkOptions: any = checkSchemaOptions(this.obj);
    if (checkOptions.err) throw new Error(checkOptions.err);
  };

  Model(ModelName: string): ModelReturnProps {
    if (typeof ModelName !== "string" && !ModelName) throw "enter valid name";
    return new Model(this.obj, ModelName);
  }
}
