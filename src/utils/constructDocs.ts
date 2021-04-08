export default (docs: any[]) => {
  const rows: any[] = new Array();
  docs.forEach((doc) => {
    rows.push(new Doc(doc));
  });

  return rows;
};

class Doc {
  constructor(doc: any) {
    const returnObj: any = new Object(doc);
    Object.defineProperties(returnObj, {
      _save: {
        enumerable: false,
        value: this.save,
      },
      _id: {
        writable: false,
        value: doc._id,
      },
    });

    return returnObj;
  }

  save() {
    console.log(Object.keys(this));
  }
}
