import { Model } from "./model";
import { SchemaRef } from "./SchemaRef";

export class Schema {
  obj: any;
  SchemaRef: any;
  constructor(doc: any) {
    if (typeof doc !== "object" || Array.isArray(doc))
      throw "enter valid Schema";

    this.obj = doc;
    this.SchemaRef = new SchemaRef(doc).newSchemaRef;

    // Object.keys(doc).forEach((x) => {
    //   if (
    //     doc[x].constructor.name ===
    //     new this.SchemaRef({ isArray: false }).constructor.name
    //   ) {
    //     // console.log(doc[x], "is Schemaref");
    //   }
    // });
  }

  Model(ModelName: string) {
    if (typeof ModelName !== "string") throw "enter valid name";
    const newModel = new Model(this.obj, ModelName);
    return { Model: newModel.createNewModel, findOne: newModel.findOne };
  }
}
