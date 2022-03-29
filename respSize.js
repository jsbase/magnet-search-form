exports.responseSize = function (res, data, next) {
  res.setHeader("Content-Length", data.length);
  next();
};
