const polka = require("polka");
const health = polka()
  .get("/:query?", (req, res) => {
    res.end(`{
      "method": "${req.method}",
      "url": "${req.url}",
      "query": "${req.params.query}"
    }`);
  })
  .post("/:query", (req, res) => {
    // res.statusCode = 200;
    res.writeHead(200, {"Content-Type": "application/json"});
    let payload = JSON.stringify(req.body);
    res.end(`{
      "method": "${req.method}",
      "url": "${req.url}",
      "body": "${payload}"
    }`);
  });

module.exports = health;
