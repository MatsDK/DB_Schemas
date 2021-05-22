import { searchQuery } from "../types";

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

  const checkOrder: any = checkIfOrderCorrect(searchQuery.orderBy);
  if (checkOrder.err) return { err: checkOrder.err };

  returnQuery.orderBy = checkOrder.newOrder;

  checkSearchProperties(searchQuery.where);
  console.log(returnQuery);
};

const queryTypes: string[] = ["$or", "$and"];

const checkSearchProperties = (searchQuery: any) => {
  if (typeof searchQuery === "object" && searchQuery != null)
    if ("$or" in searchQuery) {
      console.log("or statement");
    }

  if ("$and" in searchQuery) {
    console.log("and statement");
  }

  const queryKeys: string[] = Object.keys(searchQuery).filter(
    (_: string) => !queryTypes.includes(_)
  );

  for (const key of queryKeys) {
    console.log(key, searchQuery[key]);
  }
};

const checkIfOrderCorrect = (
  order: any
): { err: string } | { newOrder: any } => {
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
