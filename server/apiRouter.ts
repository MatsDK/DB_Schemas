import express from "express";
import fs from "fs";
import bson from "bson";
import { nanoid } from "nanoid";
import _ from "lodash";

const router = express.Router();
const DATA_FOLDER = "./data/";

router.get("/", (req, res) => {
  res.send("api");
});

interface insertDocBody {
  schema: any;
  modelName: string;
  doc: any;
}

interface dataFileDBType {
  dbName: string;
  dbId: string;
  schema: any;
}

router.post("/insertDoc", (req, res) => {
  try {
    const { modelName, schema }: insertDocBody = req.body;

    const dataFile: any = bson.deserialize(
        fs.readFileSync(`${DATA_FOLDER}data`)
      ),
      dbs: dataFileDBType[] = dataFile.dbs;

    const dbExists = dbs.find((db: dataFileDBType) => db.dbName === modelName);
    if (dbExists) {
      console.log(_.isEqual(dbExists.schema, schema));
      return res.send("exists");
    }

    const newDBObj: dataFileDBType = {
      dbName: modelName,
      dbId: nanoid(),
      schema,
    };
    dbs.unshift(newDBObj);
    fs.writeFileSync(`${DATA_FOLDER}data`, bson.serialize(dataFile));

    res.json(dbs);
  } catch (err) {
    return res.send({ err: err.message });
  }
});

export default router;
