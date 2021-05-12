import { constructSchema } from "./utils/constructSchema";
import { SchemaType, NewSchemaType } from "./utils/types";

export class Schema implements NewSchemaType {
  obj: any;
  _schema: any;

  constructor(obj: any) {
    const schemaObj: SchemaType = constructSchema(obj);

    this._schema = schemaObj;
    this.obj = obj;
  }
}
