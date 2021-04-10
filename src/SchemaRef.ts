import { Model } from "./model";
import { SchemaRefOptionsProps } from "./SchemaInterfaces";

export class SchemaRef {
  newSchemaRef: any;
  constructor(schema: any) {
    this.newSchemaRef = class newSchemaRef {
      isArray: boolean;
      schema: any;
      model: any;
      modelName: string;
      _isSchemaRef: boolean;

      constructor(schemaName: string, { isArray }: SchemaRefOptionsProps) {
        this.schema = schema;
        this.modelName = schemaName;
        this.isArray = isArray;
        this.model = new Model(schema, "");
        this._isSchemaRef = true;
      }
    };
  }
}
