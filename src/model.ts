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

        const returnObj: any = new Object({ ...doc });

        Object.defineProperties(returnObj, {
          _save: {
            enumerable: false,
            value: this.#_save,
          },
          schema: {
            enumerable: false,
            value: this.schema,
          },
          doc: {
            enumerable: false,
            value: this.doc,
          },
          modelName: {
            enumerable: false,
            value: this.modelName,
          },
        });

        return returnObj;
      }

      #checkDocument = () => {
        const newDoc = checkModelRecursive(
          this.schema,
          this.doc,
          this.modelName
        );
        if (newDoc.err) console.error(newDoc.err);
        this.doc = newDoc.doc;
      };

      #_save = () => {
        const checkModel = checkModelRecursive(
          this.schema,
          this.doc,
          this.modelName
        );
        if (checkModel.err) return console.error(checkModel.err);

        console.log(checkModel.doc);
      };
    };
  }

  findOne() {
    console.log("findOne");
  }
}
