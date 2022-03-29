const send = require("@polka/send-type");
const TorrentSearchApi = require("torrent-search-api");
const headers = require("./headers").json;
const status = require("./status.js");
const warning = require("./warning").notorrents;

module.exports = async function torrents(req, res) {
  try {
    let json = JSON.stringify(req.body);
    let {query = "1080p", category = "All", limit = 1} = JSON.parse(json);
    //    console.log(
    //      `{ "query": "${query}", "category": "${category}", "limit": ${limit}`
    //    );
    let torrents = await TorrentSearchApi.search(query, category, limit);
    //console.log('torrents: ', torrents);
    send(res, status.success, torrents);
    /*
    const filtered = torrents.filter(
      (x) => parseInt(x?.peers) >= 1 && parseInt(x?.seeds) >= 1
    );
    */
    /*if (!torrents || !torrents.length) {
      send(res, status.empty, warning);
    } else {
      send(res, status.success, torrents, headers);
    }*/
    //return Promise.resolve(torrents);
  } catch (err) {
    send(res, status.fail, warning);
  }
};
