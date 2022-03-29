require("dotenv").config();
// const {createServer} = require("https");
// const {readFileSync} = require("fs");
const polka = require("polka");
const compress = require("compression");
const {json} = require("body-parser");
const sirv = require("sirv");
//const health = require("./health");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const torrents = require("./torrents");
const magnet = require("./magnet");
/**
 * @see https://github.com/JimmyLaurent/torrent-search-api
 */
const TorrentSearchApi = require("torrent-search-api");
TorrentSearchApi.enablePublicProviders();
TorrentSearchApi.disableProvider("1337x");

const {NODE_ENV, HOST, PORT, TORRENTS_API, MAGNET_API} = process.env;
const isDev = NODE_ENV !== "production";

// const polkaMiddleware =
polka()
  .use(
    morgan(isDev ? "dev" : "tiny", {immediate: !isDev}),
    cors(/*{origin: true}*/),
    cookieParser(),
    compress(),
    sirv("public"),
    json() /*,
    health */
  )
  .post(TORRENTS_API, torrents)
  .post(MAGNET_API, magnet)
  .listen(PORT, () => {
    if (isDev) {
      console.log(`> Running on ${HOST}:${PORT}`);
    }
  });
/**
 * @todo SSL/HTTPS settings
 */
/*
createServer(
    { key: readFileSync("./ssl/magnet-search-form.key"),
    cert: readFileSync("./ssl/magnet-search-form.crt") },
polkaMiddleware).listen(PORT, () => {
    if (isDev) { console.log(`> Running on ${HOST}:${PORT}`); }
});
*/
