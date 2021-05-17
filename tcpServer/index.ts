import net from "net";
import { eventHandler } from "./EventHandler";
import BSON from "bson";
import path from "path";
import fs from "fs";
import { collectionObj, dataBaseData } from "../types";

const handleEvents = new eventHandler();

handleEvents.on("getDatabaseData", ({ db }: { db: any }) => {
  const dbs: any = BSON.deserialize(
    fs.readFileSync(path.resolve(__dirname, "../data/data"))
  );

  const thisDb: undefined | dataBaseData = dbs.dbs[db.toLowerCase()];
  if (!thisDb) return { err: `Database ${db} not found` };

  return thisDb;
});

handleEvents.on(
  "createCollection",
  ({ db, newCollectionObj }: { db: string; newCollectionObj: any }) => {
    const dbs: any = BSON.deserialize(
      fs.readFileSync(path.resolve(__dirname, "../data/data"))
    );
    const thisDb: undefined | dataBaseData = dbs.dbs[db.toLowerCase()];
    if (!thisDb) return { err: `Database '${db}' not found` };

    if (thisDb.Collections[newCollectionObj._name.toLowerCase()])
      return {
        err: `Collection with name '${newCollectionObj._name}' already exists`,
      };

    thisDb.Collections[newCollectionObj._name.toLowerCase()] = newCollectionObj;
    fs.writeFileSync(
      path.resolve(__dirname, "../data/data"),
      BSON.serialize(dbs)
    );

    fs.writeFileSync(
      path.resolve(__dirname, `../data/${newCollectionObj._id}`),
      BSON.serialize({ _id: newCollectionObj._id, docs: [] })
    );

    return { err: false, data: thisDb.Collections };
  }
);

handleEvents.on(
  "insertDocs",
  async ({
    db,
    collection,
    docs,
    uniqueProps,
  }: {
    db: string;
    collection: string;
    docs: any[];
    uniqueProps: string[];
  }) => {
    const dbs: any = BSON.deserialize(
      fs.readFileSync(path.resolve(__dirname, "../data/data"))
    );
    const thisDb: undefined | dataBaseData = dbs.dbs[db.toLowerCase()];
    if (!thisDb) return { err: `Database '${db}' not found` };

    const thisCollection: undefined | collectionObj = Object.keys(
      thisDb.Collections
    )
      .map((_: string) => thisDb.Collections[_])
      .find((_) => _._id === collection.trim().toLowerCase());
    if (!thisCollection) return { err: `Collection not found` };

    const collectionData = BSON.deserialize(
      fs.readFileSync(path.resolve(__dirname, `../data/${thisCollection._id}`))
    );

    const checkIfDuplicateValues: getPropValuesReturn = checkIfUniqueValue(
      uniqueProps,
      docs,
      collectionData.docs
    );
    if (checkIfDuplicateValues.err) return { err: checkIfDuplicateValues.err };

    collectionData.docs = [...docs, ...collectionData.docs];
    fs.writeFileSync(
      path.resolve(__dirname, `../data/${thisCollection._id}`),
      BSON.serialize(collectionData)
    );

    return { err: false, insertedDocs: docs };
  }
);

type getPropValuesReturn = { err: boolean | string };

const checkIfUniqueValue = (
  uniqueProps: string[],
  newDocs: any[],
  docs: any[]
) => {
  for (const prop of uniqueProps) {
    const checkProp: getPropValuesReturn = getPropertyValues(
      [...newDocs, ...docs],
      prop.split(".")
    );

    if (checkProp.err) return checkProp;
  }

  return { err: false };
};

const getPropertyValues = (
  docs: any[],
  property: string[]
): getPropValuesReturn => {
  if (property.length === 1) {
    const findDuplicates = new Set();

    for (const [i, doc] of docs.entries()) {
      findDuplicates.add(doc[property[0]]);
      if (i != findDuplicates.size - 1)
        return { err: `'${property[0]}: ${doc[property[0]]}' is not unique` };
    }
  } else {
    const checkRecursive: getPropValuesReturn = getPropertyValues(
      docs.map((_: any) => _[property[0]]),
      property.slice(1)
    );

    if (checkRecursive.err) return checkRecursive;
  }

  return { err: false };
};

const server = net.createServer((conn) => {
  conn.on("data", (data) => {
    handleEvents.emit(data.toString(), conn);
  });

  conn.once("error", (err) => {
    if (err) throw err;
  });
});

server.listen(2345, "127.0.0.1", () => {
  console.log("server listening");
});
