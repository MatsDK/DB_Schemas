import { isFindOptions } from "./helpers";

export default (searchQuery: any, options: any, cb: any) => {
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
