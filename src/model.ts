// import axios from "axios";
import {
  checkModelOptions,
  checkModelRecursive,
  constructObj,
} from "./utils/checkModel";

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

        const returnObj: any = new Object(doc);
        Object.defineProperties(returnObj, {
          _save: {
            enumerable: false,
            value: this.#_save,
          },
          _schema: {
            enumerable: false,
            value: this.schema,
          },
          _doc: {
            enumerable: false,
            value: this.doc,
          },
          _modelName: {
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
        this.doc = checkModel.doc;
      };

      #_save = (cb: Function | undefined) => {
        const checkModel = checkModelRecursive(
          this.schema,
          this.doc,
          this.modelName
        );
        if (checkModel.err) throw new Error(checkModel.errData);
        console.log(checkModelOptions(checkModel.doc, this.schema));
        // axios({
        //   method: "POST",
        //   url: "http://localhost:3001/api/insertDoc",
        //   data: {
        //     doc: checkModel.doc,
        //     modelName: this.modelName,
        //     schema: this.schema,
        //   },
        // })
        //   .then((res) => {
        //     // if (cb) cb(res.data[0].rows);
        //   })
        //   .catch((err) => {
        //     throw new Error(err);
        //   });
      };
    };
  }

  find(props) {
    console.log(this.modelName);
  }

  findOne() {
    console.log(this.modelName);
  }
}
