module.exports = {
  MongoIDPattern: /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i,
  ROLES: Object.freeze({
    USER: "USER",
    ADMIN: "ADMIN",
    CONTENT_MANAGER: "CONTENT_MANAGER",
    TEACHER: "TEACHER",
    SUPPLIER: "SUPPLIER",
  }),
  PERMISSIONS: Object.freeze({
    USER: ["profile"],
    ADMIN: ["all"],
    SUPERADMIN: ["all"],
    CONTENT_MANAGER: ["course", "blog", "category", "product"],
    TEACHER: ["course", "blog"],
    SUPPLIER: ["product"],
    ALL: "all",
  }),

  // parsastore-hashstring
  ACCESS_TOKEN_SECRET_KEY:
    "E2860152BE04271CD82B63A6926767B282C4138FB4F9CAA65615BDAA211C0044",
  REFRESH_TOKEN_SECRET_KEY:
    "02CCFB8E3BF8BD69C904CAEA42D1F28200B7834E147DE2D3A95C8E02602CE6ED",
};

// Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtb2JpbGUiOiIwOTExNjY4ODIyMyIsInVzZXJJRCI6IjY0ZjcwM2M2ODA0MGU0NGZhYmYwOTNjNyIsImlhdCI6MTY5NDM1MTM3NiwiZXhwIjoxNjk0MzU0OTc2fQ.6ezUPlp7LZHvpS8lJ1eO97gtkAzssztQQSFcsOewvZM
