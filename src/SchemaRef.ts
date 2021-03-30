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
      constructor(schemaName: string, { isArray }: SchemaRefOptionsProps) {
        this.schema = schema;
        this.modelName = schemaName;
        this.isArray = isArray;
        this.model = new Model(schema, "");
      }
    };
  }
}
