import { SchemaType } from "./Collection";
import { constructSchema } from "./utils/constructSchema";

interface NewSchemaType {
  obj: any;
}

export class Schema implements NewSchemaType {
  obj: any;
  _schema: any;

  constructor(obj: any) {
    const schemaObj: SchemaType = constructSchema(obj);

    console.log(schemaObj.properties[0]);
    this._schema = schemaObj;
    this.obj = obj;
  }
}
