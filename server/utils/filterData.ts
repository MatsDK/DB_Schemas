export default (filterQuery: any, rows: any[]): any[] => {
  const filterKeys: any[][] = Object.keys(
    filterQuery
  ).map((key: string): any[] => [key, filterQuery[key]]);
  const returnArr: any[] = new Array();

  for (let idx = 0; idx < rows.length; idx++) {
    let isValid: boolean = true;

    filterKeys.forEach((key: any[]) => {
      if (typeof key[1] === "object" && key[1] != null) {
        const isEqual: boolean = isEqualRecursive(rows[idx][key[0]], key[1]);
        if (!isEqual) return (isValid = false);
      } else if (rows[idx][key[0]] != key[1]) return (isValid = false);
    });
    if (isValid) returnArr.push(rows[idx]);
  }

  return returnArr;
};

const isEqualRecursive = (obj1: any, obj2: any): boolean => {
  const objKeys: string[] = Object.keys(obj1);

  for (let idx = 0; idx < objKeys.length; idx++) {
    if (typeof obj2[objKeys[idx]] === "object" && obj2[objKeys[idx]] != null) {
      const checkRecursive: boolean = isEqualRecursive(
        obj1[objKeys[idx]],
        obj2[objKeys[idx]]
      );
      if (!checkRecursive) return false;
    } else if (obj1[objKeys[idx]] != obj2[objKeys[idx]]) return false;
  }
  return true;
};
