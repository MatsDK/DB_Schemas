import express, { Request, Response } from "express";
import fs from "fs";
import BSON from "bson";
import { nanoid } from "nanoid";
// import _ from "lodash";
import { checkKeys } from "./utils/checkKeys";

const router = express.Router();
const DATA_FOLDER = "./data/";

interface insertDocBody {
  schema: any;
  modelName: string;
  doc: any;
}

interface dataFileDBType {
  dbName: string;
  dbId: string;
  schema: any;
  rows: any[];
}

router.post("/insertDoc", (req: Request, res: Response) => {
  try {
    const { modelName, schema, doc }: insertDocBody = req.body;

    const dataFile: any = BSON.deserialize(
        fs.readFileSync(`${DATA_FOLDER}data`)
      ),
      dbs: dataFileDBType[] = dataFile.dbs;

    const dbExists = dbs.find((db: dataFileDBType) => db.dbName === modelName);
    if (dbExists && !checkKeys(dbExists!.schema, schema))
      return res.json({
        err: `DB with name ${modelName} already exists with other schema properties`,
      });

    if (!dbExists) {
      const newDBObj: dataFileDBType = {
        dbName: modelName,
        dbId: nanoid(),
        schema,
        rows: [{ ...doc }] || [],
      };

      dbs.unshift(newDBObj);
    } else if (typeof doc !== "undefined") dbExists.rows.unshift(doc);

    fs.writeFileSync(`${DATA_FOLDER}data`, BSON.serialize(dataFile));

    res.json(dbs);
  } catch (err) {
    return res.send({ err: err.message });
  }
});

router.get("/getData", (req: Request, res: Response) => {
  const data = BSON.deserialize(fs.readFileSync(`./data/data`));
  res.json(data);
});

export default router;
