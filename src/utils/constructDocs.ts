import axios from "axios";
import { checkModelOptions, checkModelRecursive } from "./model/checkModel";

export default (docs: any[], schema: any, modelName: string) => {
  const rows: any[] = new Array();
  docs.forEach((doc) => {
    rows.push(new Doc(doc, schema, modelName));
  });

  return rows;
};

class Doc {
  _id: string;
  _schema: any;
  _modelName: string;

  constructor(doc: any, schema: any, modelName: string) {
    this._schema = schema;
    this._id = doc._id;
    this._modelName = modelName;

    const returnObj: any = new Object(doc);
    Object.defineProperties(returnObj, {
      _save: {
        enumerable: false,
        writable: false,
        value: this.save,
      },
      _id: {
        writable: false,
        value: doc._id,
      },
      _schema: {
        writable: false,
        enumerable: false,
        value: schema,
      },
      _modelName: {
        writable: false,
        enumerable: false,
        value: modelName,
      },
    });

    return returnObj;
  }

  save(cb: any) {
    const thisId = this._id,
      checkRecursive: {
        err?: boolean | string;
        doc?: any;
      } = checkModelRecursive(this._schema, this, this._modelName);

    if (checkRecursive.err) {
      if (cb) return cb(null, checkRecursive.err);
      throw checkRecursive.err;
    }

    const checkDocOptions: { err?: boolean | string } = checkModelOptions(
      checkRecursive.doc,
      this._schema
    );
    if (checkDocOptions.err) {
      if (cb) return cb(null, checkDocOptions.err);
      throw checkDocOptions.err;
    }

    axios({
      method: "POST",
      url: "http://localhost:3001/api/updateStrict",
      data: {
        modelName: this._modelName,
        searchQuery: { _id: thisId },
        updateQuery: this,
      },
    })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        throw err;
      });

    if (cb) return cb("saved", null);
    return null;
  }
}
