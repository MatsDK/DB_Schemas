import axios from "axios";
import { checkModelRecursive, constructObj } from "./utils/checkModel";

export class Model {
  Model: any;
  schema: any;
  modelName: string;

  constructor(schema: any, modelName: string) {
    this.modelName = modelName;
    this.schema = schema;

    this.Model = class newModel {
      doc: any;
      schema: any;
      modelName: string;

      constructor(doc: any) {
        this.doc = doc;
        this.modelName = modelName;
        this.schema = schema;
        this.#createDoc();

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

      #createDoc = () => {
        this.doc = constructObj(this.schema, this.doc);
        const checkModel = checkModelRecursive(
          this.schema,
          this.doc,
          this.modelName
        );

        if (checkModel.err) throw new Error(checkModel.errData);
      };

      #_save = () => {
        const checkModel = checkModelRecursive(
          this.schema,
          this.doc,
          this.modelName
        );
        if (checkModel.err) throw new Error(checkModel.errData);

        axios({
          method: "POST",
          url: "http://localhost:3001/api/insertDoc",
          data: {
            doc: checkModel.doc,
            modelName: this.modelName,
            schema: this.schema,
          },
        })
          .then((res) => {
            console.log(res.data);
          })
          .catch((err) => {
            return console.error(err);
          });
      };
    };
  }

  findOne() {
    console.log(this.modelName);
  }
}
