exports.send = function (res, data) {
  res.setHeader("Content-Length", data.length);
  res.end(data);
};
