import axios from "axios";
import { checkModelRecursive } from "./checkModel";

interface saveDocProps {
  schema: any;
  doc: any;
  modelName: string;
  cb: Function | undefined;
}

const saveDoc = (props: saveDocProps) => {
  const { schema, doc, modelName, cb }: saveDocProps = props;
  const checkModel = checkModelRecursive(schema, doc, modelName);
  if (checkModel.err) throw new Error(checkModel.errData);

  axios({
    method: "POST",
    url: "http://localhost:3001/api/insertDoc",
    data: {
      doc: checkModel.doc,
      modelName: modelName,
      schema: schema,
    },
  })
    .then((res) => {
      if (cb) {
        if (res.data.err) return cb(null, res.data.err);
        else return cb("saved", null);
      }
      return res.data.rows;
    })
    .catch((err) => {
      throw new Error(err);
    });
};

const findDocs = (modelName: string, { cb, ...rest }) => {
  if (!modelName) throw new Error("Invalid DB name");

  axios({
    method: "POST",
    url: `http://localhost:3001/api/findData`,
    data: { modelName, ...rest },
  })
    .then((res) => {
      if (res.data.err) {
        if (cb) return cb(null, res.data.err);
        throw new Error(res.data.err);
      }
      if (cb) return cb(res.data.rows, null);
      return res.data.rows;
    })
    .catch((err) => {
      throw new Error(err);
    });
};

export { saveDoc, findDocs };
