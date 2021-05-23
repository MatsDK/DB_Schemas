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
      ).idxs;

      validDocsIdxs = getCommonIdxsFromSets(recursiveValidIdxs, validDocsIdxs);
    }
  }

  if ("$or" in query) {
    const ORstatemenValidIdxs: Set<number> = new Set();
    for (const ORStatement of query["$or"])
      Array.from(filterData(data, ORStatement).idxs).forEach((_: number) =>
        ORstatemenValidIdxs.add(_)
      );

    validDocsIdxs = getCommonIdxsFromSets(ORstatemenValidIdxs, validDocsIdxs);
  }

  return { idxs: validDocsIdxs };
};

const getCommonIdxsFromSets = (
  set1: Set<number>,
  set2: Set<number>
): Set<number> =>
  new Set(
    Array.from(set1)
      .map((_: number) => (set2.has(_) ? _ : undefined))
      .filter((_: any) => _ != null)
  ) as Set<number>;

const isValidDoc = (
  queryOptionsObj: queryOptionsObj,
  key: string,
  doc: any
): boolean => {
  if ("$equals" in queryOptionsObj && doc[key] != queryOptionsObj.$equals)
    return false;

  if ("$gt" in queryOptionsObj && doc[key] <= queryOptionsObj.$gt) return false;

  if ("$lt" in queryOptionsObj && doc[key] >= queryOptionsObj.$lt) return false;

  if ("$in" in queryOptionsObj) {
    if (!checkINstatement(doc[key], queryOptionsObj)) return false;
  }

  return true;
};

const checkINstatement = (
  doc: any,
  queryOptionsObj: queryOptionsObj
): boolean => {
  if (!Array.isArray(doc)) return false;

  if (Array.isArray(queryOptionsObj.$in)) {
    for (const idx in queryOptionsObj.$in)
      if (
        !filterData(
          doc.map((_: any) => ({ data: _ })),
          { data: queryOptionsObj.$in[idx] }
        ).idxs.size
      )
        return false;
  } else {
    if (!isSearchOptionsObj(queryOptionsObj.$in)) {
      if (!filterData(doc, queryOptionsObj.$in).idxs.size) return false;
    } else {
      if (
        !filterData(
          doc.map((_: any) => ({ data: _ })),
          { data: queryOptionsObj.$in }
        ).idxs.size
      ) {
        return false;
      }
    }
  }

  return true;
};

const searchOptions: string[] = ["$equals", "$in", "$gt", "$lt"];

const isSearchOptionsObj = (obj: any): boolean => {
  if (typeof obj !== "object" || !obj) return false;

  return Object.keys(obj).every((_: string) => searchOptions.includes(_));
};
