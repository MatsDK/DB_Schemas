import { checkModelRecursive } from "./utils/checkModel";

export class Model {
  createNewModel: any;

  constructor(schema: any, modelName: string) {
    this.createNewModel = class newModel {
      doc: any;
      schema: any;
      modelName: string;

      constructor(doc: any) {
        this.doc = doc;
        this.modelName = modelName;
        this.schema = schema;
        this.#checkDocument();
      }

      #checkDocument = () => {
        this.doc = checkModelRecursive(this.schema, this.doc, this.modelName);
      };

      save() {
        console.log("save");
      }
    };
  }

  findOne() {
    console.log("findOne");
  }
}
