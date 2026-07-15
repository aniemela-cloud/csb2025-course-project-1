const info = (...params) => {
  if (process.env.NODE_ENV !== "production") {
    console.log(...params);
  }
};

const debug = (...params) => {
  if (process.env.NODE_ENV === "development") {
    console.log(...params);
  }
};

const error = (...params) => {
  if (process.env.NODE_ENV !== "test") {
    console.error(...params);
  }
};

module.exports = { info, error };
