import { queryOptionsObj } from "../../../types";

const queryTypes: string[] = ["$or", "$and"];

export const filterData = (data: any[], query: any) => {
  const propertyKeys: string[] = Object.keys(query).filter(
    (_: string) => !queryTypes.includes(_)
  );

  let validDocsIdxs: Set<number> = new Set();
  Array(data.length)
    .fill(0)
    .forEach((_, idx) => {
      validDocsIdxs.add(idx);
    });

  for (const key of propertyKeys) {
    const thisValue = query[key];

    if (isSearchOptionsObj(thisValue))
      for (const [idx, doc] of data.entries()) {
        if (!isValidDoc(thisValue, key, doc)) validDocsIdxs.delete(idx);
      }
    else if (typeof thisValue === "object" && thisValue != null) {
      const recursiveValidIdxs = filterData(
        data.map((_: any) => _[key]),
        thisValue
      ).ids;

      const newSet: Set<number> = new Set();
      Array.from(recursiveValidIdxs).forEach((_: number) => {
        if (validDocsIdxs.has(_)) newSet.add(_);
      });

      validDocsIdxs = newSet;
    }
  }

  return { ids: validDocsIdxs };
};

const isValidDoc = (
  queryOptionsObj: queryOptionsObj,
  key: string,
  doc: any
): boolean => {
  if ("$equals" in queryOptionsObj && doc[key] != queryOptionsObj.$equals)
    return false;

  return true;
};

const searchOptions: string[] = ["$equals", "$in", "$gt", "$lt"];

const isSearchOptionsObj = (obj: any): boolean => {
  if (typeof obj !== "object" || !obj) return false;

  return Object.keys(obj).every((_: string) => searchOptions.includes(_));
};
