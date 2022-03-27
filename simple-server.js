const server = require("polka");
const send = require("@polka/send-type");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const {json} = require("body-parser");
const sirv = require("sirv");
const TorrentSearchApi = require("torrent-search-api");
// const { crud } = require('./crud');

const {PORT = 3000} = process.env;
const STATUS = {success: 200, empty: 400, fail: 404};

TorrentSearchApi.enablePublicProviders();

server()
  .use(cors())
  .use(morgan("dev"))
  .use(json())
  .use(cookieParser())
  .use(sirv("public"))
  .post("/torrents", async (req, res) => {
    try {
      const json = JSON.stringify(req.body);
      const {query = "1080p", category = "All", limit = 1} = JSON.parse(json);
      const torrents = await TorrentSearchApi.search(query, category, limit);
      const filtered = torrents.filter(
        (x) => parseInt(x?.peers) >= 1 && parseInt(x?.seeds) >= 1
      );
      send(res, STATUS.success, filtered);
    } catch (err) {
      send(res, STATUS.fail);
    }
  })
  .post("/magnet", async (req, res) => {
    try {
      const json = JSON.stringify(req.body);
      const magnet = await TorrentSearchApi.getMagnet(JSON.parse(json).torrent);
      send(res, STATUS.success, magnet);
    } catch (err) {
      send(res, STATUS.fail);
    }
  })
  .listen(PORT, () => {
    console.log(`> Running on localhost:${PORT}`);
  });
