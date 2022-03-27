const {createServer} = require("https");
const {readFileSync} = require("fs");
// const fetch = require("node-fetch");
const polka = require("polka");
// const send = require("@polka/send-type");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const {post} = require("./crud");
// const { send } = require('./util');
const {json} = require("body-parser");
const sirv = require("sirv");
/**
 * @see https://github.com/JimmyLaurent/torrent-search-api
 * */
const TorrentSearchApi = require("torrent-search-api");

require("dotenv").config();

const {
  NODE_ENV,
  HOST,
  PORT
  // TORRENTS_API,
  // MAGNET_API
} = process.env;
const isDev = NODE_ENV !== "production";
// const STATUS = {success: 200, empty: 400, fail: 404};

/*
const WARNING = {
  success: "✅ Everything's fine",
  notorrents: "⛔ Couldn't find any torrents",
  nomagnet: "⛔ Couldn't find any magnet link"
};
*/

/*
const HEADER = {
  encoded: {"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"},
  json: {"Content-Type": "application/json; charset=UTF-8"},
  text: {"Content-Type": "text/plain; charset=UTF-8"}
};
*/

// async request with node-fetch
/*
const load = async (url, opts) => {
  const data = await fetch(url, opts);
  const result = await result.json();
  return result;
};
*/

TorrentSearchApi.enablePublicProviders();
TorrentSearchApi.disableProvider("1337x"); // optional

const polkaMiddleware = polka();
polkaMiddleware
  .use(cors())
  .use(morgan(isDev ? "dev" : "tiny", {immediate: isDev}))
  .use(json())
  .use(cookieParser())
  .use(sirv("public"))
  .use(post())
  .post(); /*
  .listen(PORT, () => {
    if (isDev) {
      // eslint-disable-next-line no-console
      console.log(`> Running on ${HOST}:${PORT}`);
    }
  })
  */

createServer(
  {
    key: readFileSync("./ssl/magnet-search-form.key"),
    cert: readFileSync("./ssl/magnet-search-form.crt")
  },
  polkaMiddleware
).listen(PORT, () => {
  if (isDev) {
    // eslint-disable-next-line no-console
    console.log(`> Running on ${HOST}:${PORT}`);
  }
});
