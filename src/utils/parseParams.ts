export default (searchQuery: any, options: any, cb: any) => {
  if (typeof cb === "function") cb = cb;
  if (typeof searchQuery === "object") searchQuery = searchQuery;

  if (
    typeof options === "function" &&
    typeof cb === "undefined" &&
    isFindOptions(searchQuery)
  ) {
    cb = options;

    if (isFindOptions(searchQuery)) {
      options = searchQuery;
      searchQuery = {};
    }
  } else if (
    typeof searchQuery === "function" &&
    typeof options === "undefined" &&
    typeof cb === "undefined"
  ) {
    cb = searchQuery;
    searchQuery = {};
    options = { limit: undefined, skip: 0 };
  }

  if (typeof options?.skip === "number") options.skip = options.skip;
  if (typeof options?.limit === "number") options.limit = options.skip;

  return { searchQuery, options, cb };
};

const findOptionsKeys = ["limit", "skip"];
const isFindOptions = (obj: any): boolean => {
  return Object.keys(obj).every((key: string) => findOptionsKeys.includes(key));
};
