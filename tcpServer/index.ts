import net from "net";
import { eventHandler } from "./EventHandler";
import BSON from "bson";
import path from "path";
import fs from "fs";
import {
  collectionObj,
  dataBaseData,
  findDataProps,
  insertProps,
  updateDocsProps,
} from "../types";
import { insertHandler } from "./handlers/insert";
import { findData } from "./handlers/find";
import { checkIfUniqueValue } from "./handlers/helpers/uniqueValues";

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

handleEvents.on("insertDocs", async (props: insertProps) => {
  return insertHandler(props);
});

handleEvents.on("findData", async (props: findDataProps) => {
  return findData(props);
});

handleEvents.on(
  "updateDocs",
  async ({ db, collection, docs, uniqueProps }: updateDocsProps) => {
    try {
      const dbs: any = BSON.deserialize(
        fs.readFileSync(path.resolve(__dirname, "../data/data"))
      );
      const thisDb: undefined | dataBaseData = dbs.dbs[db.toLowerCase()];
      if (!thisDb) return { err: `Database '${db}' not found` };

      const thisCollection: undefined | collectionObj =
        thisDb.Collections[collection.trim().toLowerCase()];
      if (!thisCollection)
        return { err: `Collection '${collection} not found'` };

      const thisCollectionData = BSON.deserialize(
        fs.readFileSync(
          path.resolve(__dirname, `../data/${thisCollection._id}`)
        )
      );

      const newDocs = [...thisCollectionData.docs];
      for (let doc of docs) {
        const idx: number = thisCollectionData.docs.findIndex(
          (_: any) => doc._id && _._id === doc._id
        );
        if (idx < 0) return { err: "Document not found" };

        const currArr: any[] = thisCollectionData.docs;
        currArr.splice(idx, 1);

        const checkUniqueValues: { err: boolean | string } = checkIfUniqueValue(
          uniqueProps,
          [doc],
          currArr
        );

        if (checkUniqueValues.err) return { err: checkUniqueValues.err };

        newDocs[idx] = doc;
      }
      thisCollectionData.docs = newDocs;

      fs.writeFileSync(
        path.resolve(__dirname, `../data/${thisCollection._id}`),
        BSON.serialize(thisCollectionData)
      );

      return { err: false, updatedDocs: docs };
    } catch (err) {
      console.log(err);
      return { err: err.message };
    }
  }
);

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
