require("dotenv").config();
// const {createServer} = require("https");
// const {readFileSync} = require("fs");
const polka = require("polka");
const send = require("@polka/send-type");
const {json} = require("body-parser");
const morgan = require("morgan");
//const compress = require("compression");
const sirv = require("sirv");
// const cookieParser = require("cookie-parser");
const cors = require("cors");
const headers = require("./headers");
const statusMsg = require("./status.js");
const warning = require("./warning");
// const respSize = require("./respSize");
// const health = require("./health");
// const torrents = require('./torrents');
// const magnet = require("./magnet");
/**
 * @see https://github.com/JimmyLaurent/torrent-search-api
 */
const TorrentSearchApi = require("torrent-search-api");
TorrentSearchApi.enablePublicProviders();
//TorrentSearchApi.disableProvider("1337x");

const {
  NODE_ENV,
  HOST,
  PORT = 3000,
  TORRENTS_API
  // MAGNET_API
} = process.env;

const isDev = NODE_ENV !== "production";

// const { handler } =
polka()
  .use(
    cors({
      origin: true
    }),
    morgan(isDev ? "dev" : "tiny"),
    json()
  )
  .post(TORRENTS_API, async (req, res) => {
    // res.headers["Access-Control-Allow-Origin"] = "*";

    try {
      const jsonStr = JSON.stringify(req.body);
      const {
        query = "vscode",
        category = "App",
        limit = 1
      } = JSON.parse(jsonStr);

      /*console.log(
        `\n{"query": "${query}", "category": "${category}", "limit": ${limit} }\n`
      );*/

      const torrents = await TorrentSearchApi.search(query, category, limit);

      // console.log(`\n{ "torrents": ${JSON.stringify(torrents)} }\n`);

      if (!torrents || !torrents.length) {
        send(res, statusMsg.empty, warning.notorrents);
      } else {
        let indexed = torrents.map((t, idx) => Object.assign({id: idx}, t));
        let filtered = indexed.filter(
          (x) =>
            x &&
            x.peers &&
            parseInt(x.peers) >= 1 &&
            x.seeds &&
            parseInt(x.seeds) >= 1
        );

        console.log(`\n{ "filtered": ${JSON.stringify(filtered)} }\n`);
        send(res, statusMsg.success, JSON.stringify(filtered), headers.json);
      }
    } catch (err) {
      send(res, statusMsg.fail, warning.notorrents);
    }
  })
  .listen(PORT, () => {
    if (isDev) {
      console.log(`> Running on ${HOST}:${PORT}`);
    }
  });

//.post(TORRENTS_API, torrents)
//.post(MAGNET_API, magnet)

/*
const ssl = {
  key: readFileSync("./ssl/magnet-search-form.key"),
  cert: readFileSync("./ssl/magnet-search-form.crt")
};

createServer(ssl, handler).listen(PORT, () => {
  if (isDev) {
    console.log(`> Running on ${HOST}:${PORT}`);
  }
});
*/
