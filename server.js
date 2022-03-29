require("dotenv").config();
//const {
//    createServer
//} = require("https");
//const {
//    readFileSync
//} = require("fs");
const polka = require("polka");
const send = require("@polka/send-type");
const {
    json
} = require("body-parser");
//const sirv = require("sirv");
//const compress = require("compression");
//const morgan = require("morgan");
//const cookieParser = require("cookie-parser");
const cors = require("cors");
const headers = require("./headers");
const statusMsg = require("./status.js");
const warning = require("./warning");
//const torrents = require('./torrents');
//const magnet = require("./magnet");
//const health = require("./health");
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
    TORRENTS_API /* MAGNET_API */
} = process.env;

const isDev = NODE_ENV !== "production";

//const polkaMiddleware =
//.use(
//morgan(isDev ? "dev" : "tiny", {immediate: isDev}),
//cookieParser(),
//compress(),
//sirv("public"),
// health,
//)
polka()
.use(
    cors(/*{origin: true}*/),
    json()
)
.post(TORRENTS_API, async (req, res) => {
    try {
        let json = JSON.stringify(req.body);
        let {
            query = "1080p", category = "All", limit = 1
        } = JSON.parse(json);
        // console.log(`{ "query": "${query}", "category": "${category}", "limit": ${limit}`);
        let torrents = await TorrentSearchApi.search(query, category, limit);
        console.log(`torrents: ${JSON.stringify(torrents)}`);
        // const filtered = torrents.filter((x) => parseInt(x?.peers) >= 1 && parseInt(x?.seeds) >= 1);
        if (!torrents || !torrents.length) {
            send(res, statusMsg.empty, warning.notorrents);
        } else {
            send(res, statusMsg.success, torrents, headers.json);
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
createServer(
    {
        key: readFileSync("./ssl/magnet-search-form.key"),
        cert: readFileSync("./ssl/magnet-search-form.crt")
    },
    polkaMiddleware
).listen(PORT, () => {
    if (isDev) {
        console.log(`> Running on ${HOST}:${PORT}`);
    }
});
*/