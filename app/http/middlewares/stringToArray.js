// anvaae vorudi :
// tag1#tag2#tag3#...
// string
// undefined || null
// khoruji :
// [...values] || [value] || []

const stringToArray = function (field) {
  return function (req, res, next) {
    if (typeof req.body[field] == "string") {
      if (req.body[field].indexOf("#") >= 0) {
        req.body[field] = req.body[field]
          .split("#")
          .map((item) => {
            return item.trim();
          })
          .filter((item) => item);
      } else if (req.body[field].indexOf(",") >= 0) {
        req.body[field] = req.body[field]
          .split(",")
          .map((item) => {
            return item.trim();
          })
          .filter((item) => item);
      } else {
        req.body[field] = [req.body[field]];
      }
    }
    if (Array.isArray(req.body[field])) {
      req.body[field] = req.body[field].map((item) => {
        return typeof item === "string" ? item.trim() : item;
      });
      req.body[field] = [...new Set(req.body[field])];
    } else {
      req.body[field] = [];
    }

    next();
  };
};

module.exports = { stringToArray };
