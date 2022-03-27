const polka = require("polka");
const send = require("@polka/send-type");
// const {send} = require("./util");
const TorrentSearchApi = require("torrent-search-api");
require("dotenv").config();
const {TORRENTS_API, MAGNET_API} = process.env;

module.exports = polka()
  .get("/", (req, res) => {
    send(res, "items@index");
  })
  .torrents(TORRENTS_API, async (req, res) => {
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
  })
  .magnet(MAGNET_API, async (req, res) => {
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
  }); /*
  .post("/", (req, res) => {
    send(res, "items@create");
  })
  .get("/:id", (req, res) => {
    send(res, `items@show(${req.params.id})`);
  })
  .put("/:id", (req, res) => {
    send(res, `items@edit(${req.params.id})`);
  })
  .delete("/:id", (req, res) => {
    send(res, `items@delete(${req.params.id})`);
  });
  */
