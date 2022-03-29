const send = require("@polka/send-type");
const TorrentSearchApi = require("torrent-search-api");
const headers = require("./headers").json;
const status = require("./status.js");
const warning = require("./warning").nomagnet;

module.exports = async function magnet(req, res) {
  try {
    let json = JSON.stringify(req.body);
    let torrent = JSON.parse(json).torrent;
    let magnet = await TorrentSearchApi.getMagnet(torrent);

    if (!magnet) {
      send(res, status.empty, warning);
    } else {
      send(res, status.success, JSON.stringify(magnet), headers);
    }
  } catch (err) {
    send(res, status.fail, warning);
  }
};
