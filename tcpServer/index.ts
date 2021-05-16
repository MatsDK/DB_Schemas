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
    console.log(newCollectionObj);

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
  }: {
    db: string;
    collection: string;
    docs: any[];
  }) => {
    try {
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
        fs.readFileSync(
          path.resolve(__dirname, `../data/${thisCollection._id}`)
        )
      );

      collectionData.docs = [...docs, ...collectionData.docs];
      fs.writeFileSync(
        path.resolve(__dirname, `../data/${thisCollection._id}`),
        BSON.serialize(collectionData)
      );

      return { err: false, insertedDocs: docs };
    } catch (err) {
      console.log(err);
      return { err: "Collection not found" };
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
