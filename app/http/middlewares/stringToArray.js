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
    } else if (
      req.body[field] !== undefined &&
      req.body[field].constructor.toString().toLowerCase().indexOf("array") >= 0
    ) {
      req.body[field] = req.body[field].map((item) => {
        item.trim();
      });
    } else {
      req.body[field] = [];
    }
    next();
  };
};

module.exports = { stringToArray };
