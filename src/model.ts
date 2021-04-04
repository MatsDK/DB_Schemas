import { checkModelRecursive, constructObj } from "./utils/checkModel";
import * as apiReqs from "./utils/apiRequests";
import parseFindParams from "./utils/parseParams";

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
        return apiReqs.saveDoc({
          schema: this.schema,
          doc: this.doc,
          modelName: this.modelName,
          cb: cb,
        });
      };
    };
  }

  find(searchQuery: any, options: any, cb: any) {
    const parsedSearchParams = parseFindParams(searchQuery, options, cb);

    if (parsedSearchParams.options.limit === 0) {
      if (cb) return parsedSearchParams.cb("Limit can't be 0");
      throw new Error("Limit can't be 0");
    }

    return apiReqs.findDocs(this.modelName, parsedSearchParams);
  }

  findOne() {
    console.log(this.modelName);
  }
}
