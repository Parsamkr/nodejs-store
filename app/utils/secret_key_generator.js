const crypto = require("crypto");
const key = crypto.randomBytes(32).toString("hex").toUpperCase();
console.log(key);
// E2860152BE04271CD82B63A6926767B282C4138FB4F9CAA65615BDAA211C0044
// 02CCFB8E3BF8BD69C904CAEA42D1F28200B7834E147DE2D3A95C8E02602CE6ED