import express, { Request, Response } from "express";
import fs from "fs";
import BSON from "bson";
import { nanoid } from "nanoid";
import { checkKeys } from "./utils/checkKeys";
import filterData from "./utils/filterData";

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
  const thisDB: any = getThisDB(modelName);
  if (thisDB.err) return res.json(thisDB);

  const thisData: any[] = filterData(searchQuery, thisDB.rows);
  thisData.splice(0, skip);
  if (limit) thisData.length = limit;

  return res.json({ err: false, rows: thisData.filter((x: any) => x != null) });
});

interface updateDataBody {
  modelName: string;
  searchQuery: any;
  updateQuery: any;
  options: { skip: number; limit: number | undefined };
}

router.post("/updateData", (req: Request, res: Response) => {
  const {
    modelName,
    searchQuery,
    updateQuery,
    options: { skip, limit },
  }: updateDataBody = req.body;

  const thisDB: any = getThisDB(modelName);
  if (thisDB.err) return res.json(thisDB);

  const thisData: any[] = filterData(searchQuery, thisDB.rows);
  const updateKeys: any[][] = Object.keys(updateQuery).map((key: string) => [
    key,
    updateQuery[key],
  ]);

  let updated: number = 0,
    changedArr: any[] = [],
    skipped: number = 0;

  for (let i = 0; i < thisData.length; i++) {
    const row: any = thisData[i];
    let changed: boolean = false;

    if (typeof limit != "undefined" && updated >= limit) break;

    for (let j = 0; j < updateKeys.length; j++) {
      const key: string[] = updateKeys[j];
      if (!(key[0] in row)) continue;
      if (typeof row[key[0]] != "undefined") changed = true;
    }

    if (!changed) continue;
    if (skipped >= skip) {
      updated++;

      for (let j = 0; j < updateKeys.length; j++) {
        const key: string[] = updateKeys[j];
        if (
          typeof row[key[0]] === "object" &&
          row[key[0]] != null &&
          skip <= skipped
        ) {
          const updateRec: {
            err?: string | boolean;
            doc?: any;
          } = updateRecursive(row[key[0]], key);
          if (updateRec.err) return res.json({ err: updateRec.err });

          row[key[0]] = updateRec.doc;
        } else if (skip <= skipped) row[key[0]] = key[1];
      }
      changedArr.push(row);
    }

    skipped++;
    if (typeof limit !== "undefined" && updated >= limit) break;
  }

  res.json({ err: false, updatedDocs: changedArr });
});

const updateRecursive = (
  obj: any,
  updateQuery: any[]
): { err?: string | boolean; doc?: any } => {
  if (Array.isArray(obj) !== Array.isArray(updateQuery[1]))
    return { err: "can't change data type" };

  if (Array.isArray(obj)) return { err: "can't update array" };
  else {
    if (typeof updateQuery[1] !== "object" && updateQuery[1] != null) {
      if (!(updateQuery[0] in obj))
        return { err: `propery ${updateQuery[0]} does not exitst on object` };
      obj[updateQuery[0]] = updateQuery[1];
    }
    const updateKeys = Object.keys(updateQuery[1]);

    for (let i = 0; i < updateKeys.length; i++) {
      const updateKey: string = updateKeys[i];
      if (
        typeof updateQuery[1][updateKey] === "object" &&
        updateQuery[1][updateKey] != null
      ) {
        const recursiveKeys: string[][] = Object.keys(
          updateQuery[1][updateKey]
        ).map((x: string) => {
          return [x, updateQuery[1][updateKey][x]];
        });

        recursiveKeys.forEach((recursiveKey) => {
          const recursive = updateRecursive(obj[updateKey], recursiveKey);
          if (recursive.err) return { err: recursive.err };

          if (updateKey in obj) obj[updateKey] = recursive.doc;
        });
      } else if (updateKey in obj) obj[updateKey] = updateQuery[1][updateKey];
    }
  }
  return { err: false, doc: obj };
};

const getThisDB = (modelName: string) => {
  if (typeof modelName !== "string") return { err: "invalid DB name" };

  const dataFile: any = BSON.deserialize(fs.readFileSync(`${DATA_FOLDER}data`)),
    dbs: dataFileDBType[] = dataFile.dbs;

  const thisDB: dataFileDBType | undefined = dbs.find(
    (db: dataFileDBType) => db.dbName === modelName
  );
  if (!thisDB) return { err: `Database ${modelName} not found` };

  return thisDB;
};

export default router;
