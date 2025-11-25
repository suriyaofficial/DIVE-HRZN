// utils.js (or same file)
export const getUniqueValues = (data = [], key) => {
  const set = new Set();
  data.forEach((item) => {
    if (item && item[key] !== undefined && item[key] !== null && item[key] !== "") {
      set.add(item[key]);
    }
  });

  return Array.from(set).map((value) => ({
    text: String(value),
    value,
  }));
};
