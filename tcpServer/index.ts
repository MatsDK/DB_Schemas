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
} from "../types";
import { insertHandler } from "./handlers/insert";
import { findData } from "./handlers/find";

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
