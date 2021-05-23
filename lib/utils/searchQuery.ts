import {
  checkOrderReturn,
  checkORObjReturn,
  checkSearchPropertiesReturn,
  searchQuery,
  checkANDObjReturn,
} from "../types";

const defaultSearchQuery: searchQuery = {
  limit: undefined,
  skip: 0,
  orderBy: undefined,
  where: {},
};

export const parseSearchQuery = (searchQuery: searchQuery) => {
  const returnQuery: searchQuery = { ...defaultSearchQuery };

  if (typeof searchQuery.limit === "number" && searchQuery.limit >= 0)
    returnQuery.limit = searchQuery.limit;

  if (typeof searchQuery.skip === "number" && searchQuery.skip >= 0)
    returnQuery.skip = searchQuery.skip;

  const checkOrder: checkOrderReturn = checkIfOrderCorrect(searchQuery.orderBy);
  if (checkOrder.err) return { err: checkOrder.err };

  returnQuery.orderBy = checkOrder.newOrder;

  const constructedSearyQuery: checkSearchPropertiesReturn =
    checkSearchProperties(searchQuery.where);
  if (constructedSearyQuery.err) returnQuery.where = constructedSearyQuery;

  returnQuery.where = constructedSearyQuery.searchQuery;
  return returnQuery;
};

const queryTypes: string[] = ["$or", "$and"];

const checkSearchProperties = (
  searchQuery: any
): checkSearchPropertiesReturn => {
  if (typeof searchQuery !== "object" || searchQuery == null)
    return { searchQuery };

  if ("$or" in searchQuery) {
    const checkOR: checkORObjReturn = checkORObj(searchQuery);
    if (checkOR.err) return { err: checkOR.err as string };
  }

  // if ("$and" in searchQuery) {
  //   const checkAND: checkANDObjReturn = checkANDObj(searchQuery);
  //   if (checkAND?.err) return { err: checkAND.err as string };
  // }

  const queryKeys: string[] = Object.keys(searchQuery).filter(
    (_: string) => !queryTypes.includes(_)
  );

  for (const key of queryKeys) {
    if (typeof searchQuery[key] !== "object") {
      searchQuery[key] = { $equals: searchQuery[key] };
    } else if (isNestedObj(searchQuery[key])) {
      const checkProperties: checkSearchPropertiesReturn =
        checkSearchProperties(searchQuery[key]);
      if (checkProperties.err) return { err: checkProperties.err };

      searchQuery[key] = checkProperties.searchQuery;
    } else if (isINstatement(searchQuery[key])) {
      if (typeof searchQuery[key]["$in"] === "object") {
        const checkINstatement: checkSearchPropertiesReturn =
          checkSearchProperties(searchQuery[key]["$in"]);
        if (checkINstatement.err) return { err: checkINstatement.err };

        searchQuery[key]["$in"] = checkINstatement.searchQuery;
      } else searchQuery[key]["$in"] = { $equals: searchQuery[key]["$in"] };
    }
  }

  return { searchQuery };
};

const isNestedObj = (obj: any): boolean =>
  !isSearchOptionsObj(obj) && typeof obj === "object" && obj != null;

const isINstatement = (obj: any): boolean =>
  isSearchOptionsObj(obj) && "$in" in obj;

// const checkANDObj = (searchQuery: any): checkANDObjReturn => {
//   const thisValue = searchQuery["$and"];
//   if (!Array.isArray(thisValue) || thisValue.length < 2)
//     return {
//       err: "'$and' in seary query should be an array of atleast 2 items",
//     };

//   for (const ORObj of thisValue) {
//     const checkOR: checkORObjReturn = checkORObj(ORObj);
//     if (checkOR.err) return { err: checkOR.err };
//   }

//   return { err: false };
// };

const checkORObj = (searchQuery: any): checkORObjReturn => {
  const thisValue = searchQuery["$or"];
  if (!Array.isArray(thisValue) || thisValue.length < 2)
    return {
      err: "'$or' in search query should be an array of atleast 2 items",
    };

  for (let [idx, _] of thisValue.entries()) {
    const constructedSearyQuery: checkSearchPropertiesReturn =
      checkSearchProperties({ ..._ });
    if (constructedSearyQuery.err) return { err: constructedSearyQuery.err };

    thisValue[idx] = constructedSearyQuery.searchQuery;
  }

  return { err: false };
};

const searchOptions: string[] = ["$equals", "$in", "$gt", "$lt"];

const isSearchOptionsObj = (obj: any): boolean => {
  if (typeof obj !== "object" || !obj) return false;

  return Object.keys(obj).every((_: string) => searchOptions.includes(_));
};

const checkIfOrderCorrect = (order: any): checkOrderReturn => {
  if (!order) return { newOrder: undefined };

  if (typeof order === "object") {
    if (Object.keys(order).length != 1) return { newOrder: undefined };
    else {
      let thisObjValue = order[Object.keys(order)[0]];
      if (typeof thisObjValue === "string") {
        thisObjValue = thisObjValue.trim().toLowerCase();

        if (thisObjValue !== "desc" && thisObjValue !== "asc")
          return { err: "Order should be 'asc' or 'desc'" };

        order[Object.keys(order)[0]] = thisObjValue;
        return { newOrder: order };
      } else if (typeof thisObjValue === "object" && thisObjValue != null) {
        const checkRecursive: checkOrderReturn =
          checkIfOrderCorrect(thisObjValue);
        if (checkRecursive.err) return { err: checkRecursive.err };

        thisObjValue = checkRecursive.newOrder;
        return { newOrder: order };
      }
    }
  }

  return { newOrder: undefined };
};
