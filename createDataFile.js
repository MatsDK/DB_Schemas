const BSON = require("bson");
const fs = require("fs");

fs.writeFileSync(
  "./data/data",
  BSON.serialize({
    dbs: {
      users: {
        _id: "d89e69d8-9c2d-44bb-a117-17e5117fbe7",
        Collections: {},
      },
    },
  })
);
