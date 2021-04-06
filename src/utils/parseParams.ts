import { isFindOptions } from "./helpers";

export const parseFindParams = (searchQuery: any, options: any, cb: any) => {
  let newOptions = { limit: undefined, skip: 0 };

  if (typeof cb === "function") cb = cb;
  if (typeof searchQuery === "object") searchQuery = searchQuery;

  if (typeof options === "function" && typeof cb === "undefined") {
    cb = options;

    if (isFindOptions(searchQuery)) {
      newOptions = searchQuery;
      searchQuery = {};
    }
  } else if (
    typeof searchQuery === "function" &&
    typeof options === "undefined" &&
    typeof cb === "undefined"
  ) {
    cb = searchQuery;
    searchQuery = {};
    newOptions = { limit: undefined, skip: 0 };
  }

  if (typeof options?.skip === "number") newOptions.skip = options.skip;
  if (typeof options?.limit === "number") newOptions.limit = options.limit;
  if (typeof searchQuery === "undefined") searchQuery = {};

  options = newOptions;
  return { searchQuery, options, cb };
};

export const parseUpdateParams = (
  searchQuery: any,
  updateQuery: any,
  options: any,
  cb: any
) => {
  const updateErr: string =
    "update params should be (searchQuery, updateQuery, options(optional), callback(optional))";

  if (typeof options === "function" && typeof cb === "undefined") {
    cb = options;
    options = undefined;
  } else if (typeof options === "object" && !isFindOptions(options)) {
    if (cb) return cb(null, updateErr);
    throw new Error(updateErr);
  }

  if (isFindOptions(searchQuery) || isFindOptions(updateQuery)) {
    if (cb) return cb(null, updateErr);
    throw new Error(updateErr);
  }

  const newOptions: any = new Object();
  newOptions.skip = options?.skip ?? 0;
  newOptions.limit = options?.limit ?? undefined;

  if ("_id" in updateQuery) {
    if (cb) return cb(null, "can't update '_id' property");
    throw new Error("can't update '_id' property");
  }
  if (options?.limit == 0) {
    if (cb) return cb(null, "limit can't be 0");
    throw new Error("limit can't be 0");
  }

  return { searchQuery, updateQuery, options: newOptions, cb };
};
