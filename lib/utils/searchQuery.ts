import {
  checkOrderReturn,
  checkORObjReturn,
  checkSearchPropertiesReturn,
  searchQuery,
} from "../types";

const defaultSearchQuery: searchQuery = {
  limit: undefined,
  skip: 0,
  orderBy: undefined,
  where: {},
};

export const parseSearchQuery = (searchQuery: searchQuery) => {
  const returnQuery: searchQuery = { ...defaultSearchQuery };

  if (typeof searchQuery.limit === "number")
    returnQuery.limit = searchQuery.limit;

  if (typeof searchQuery.skip === "number") returnQuery.skip = searchQuery.skip;

  const checkOrder: checkOrderReturn = checkIfOrderCorrect(searchQuery.orderBy);
  if (checkOrder.err) return { err: checkOrder.err };

  returnQuery.orderBy = checkOrder.newOrder;

  const constructedSearyQuery: checkSearchPropertiesReturn =
    checkSearchProperties(searchQuery.where);
  if (constructedSearyQuery.err) returnQuery.where = constructedSearyQuery;

  console.log(constructedSearyQuery.searchQuery.$or);
  returnQuery.where = constructedSearyQuery.searchQuery;
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

  if ("$and" in searchQuery) {
    console.log("and statement");
  }

  const queryKeys: string[] = Object.keys(searchQuery).filter(
    (_: string) => !queryTypes.includes(_)
  );

  for (const key of queryKeys) {
    if (typeof searchQuery[key] !== "object")
      searchQuery[key] = { $equals: searchQuery[key] };
    else if (
      !isSearchOptionsObj(searchQuery[key]) &&
      typeof searchQuery[key] === "object" &&
      searchQuery[key] != null
    ) {
      const checkProperties: checkSearchPropertiesReturn =
        checkSearchProperties(searchQuery[key]);
      if (checkProperties.err) return { err: checkProperties.err };

      searchQuery[key] = checkProperties.searchQuery;
    }
  }

  return { searchQuery };
};

const checkORObj = (searchQuery: any): checkORObjReturn => {
  const thisValue = searchQuery["$or"];
  if (!Array.isArray(thisValue) || thisValue.length > 2)
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
        const checkRecursive: any = checkIfOrderCorrect(thisObjValue);
        if (checkRecursive.err) return { err: checkRecursive.err };

        thisObjValue = checkRecursive.newOrder;
        return { newOrder: order };
      }
    }
  }

  return { newOrder: undefined };
};
