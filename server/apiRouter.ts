import express, { Request, Response } from "express";
import fs from "fs";
import BSON from "bson";
import { nanoid } from "nanoid";
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
        rows: [{ _id: nanoid(), ...doc }] || [],
      };

      dbs.unshift(newDBObj);
    } else if (typeof doc !== "undefined")
      dbExists.rows.unshift({ _id: nanoid(), ...doc });

    fs.writeFileSync(`${DATA_FOLDER}data`, BSON.serialize(dataFile));

    res.json({ err: false });
  } catch (err) {
    return res.send({ err: err.message });
  }
});

interface findDataReqBody {
  modelName: string;
  searchQuery: any;
  options: { skip: number; limit: number | undefined };
}

router.post("/findData", (req: any, res: Response) => {
  const {
    modelName,
    searchQuery,
    options: { skip, limit },
  }: findDataReqBody = req.body;
  if (typeof modelName !== "string")
    return res.json({ err: "invalid DB name" });
  console.log(modelName, searchQuery, skip, limit);

  const dataFile: any = BSON.deserialize(fs.readFileSync(`${DATA_FOLDER}data`)),
    dbs: dataFileDBType[] = dataFile.dbs;

  const thisDB = dbs.find((db: dataFileDBType) => db.dbName === modelName);
  if (!thisDB) return { err: `Database ${modelName} not found` };

  return res.json({ err: false, rows: thisDB.rows });
});

export default router;
