const polka = require("polka");
const send = require("@polka/send-type");
// const {send} = require("./util");
const TorrentSearchApi = require("torrent-search-api");
require("dotenv").config();

const {TORRENTS_API, MAGNET_API} = process.env;
const STATUS = {success: 200, empty: 400, fail: 404};
const WARNING = {
  success: "✅ Everything's fine",
  notorrents: "⛔ Couldn't find any torrents",
  nomagnet: "⛔ Couldn't find any magnet link"
}; /*
const HEADER = {
  encoded: {"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"},
  json: {"Content-Type": "application/json; charset=UTF-8"},
  text: {"Content-Type": "text/plain; charset=UTF-8"}
};
*/

const postTorrents = async (req, res) => {
  try {
    const json = JSON.stringify(req.body);
    const {query = "1080p", category = "All", limit = 1} = JSON.parse(json);
    // eslint-disable-next-line no-console
    console.log(
      `\n POST \n
        query: ${query} \n
        category: ${category} \n
        limit: ${limit} \n`
    );
    const torrents = await TorrentSearchApi.search(query, category, limit);
    const filtered = torrents.filter(
      (x) => parseInt(x?.peers) >= 1 && parseInt(x?.seeds) >= 1
    );
    send(res, STATUS.success, filtered);
  } catch (err) {
    send(res, STATUS.fail);
  }
};

const postMagnet = async (req, res) => {
  try {
    const json = JSON.stringify(req.body);
    const torrent = JSON.parse(json).torrent;
    const magnet = await TorrentSearchApi.getMagnet(torrent);

    if (!magnet) {
      send(res, WARNING.nomagnet, STATUS.empty);
    } else {
      send(res, STATUS.success, magnet);
    }
  } catch (err) {
    send(res, STATUS.fail);
  }
};

module.exports = polka()
  .post(TORRENTS_API, postTorrents)
  .post(MAGNET_API, postMagnet);
// .get("/", (req, res) => { send(res, WARNING.success); })
// .get("/:id", (req, res) => { send(res, `items@show(${req.params.id})`); })
// .put("/:id", (req, res) => { send(res, `items@edit(${req.params.id})`); })
// .delete("/:id", (req, res) => { send(res, `items@delete(${req.params.id})`); })
