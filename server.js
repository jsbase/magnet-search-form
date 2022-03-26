const {join} = require("path");
// { createServer } = require('https'),
// { readFileSync } = require('fs'),
const server = require("polka");
// const send = require('@polka/send')
const send = require("@polka/send-type");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const {json} = require("body-parser");
const dir = join(__dirname, "public");
const serve = require("serve-static")(dir);
const TorrentSearchApi = require("torrent-search-api");

const {API, HOST, PORT, NODE_ENV} = process.env;
const isDev = NODE_ENV === "development";
const STATUS = {success: 200, empty: 400, fail: 404};
const WARNING = {empty: "Search query must not be empty!"};
const HEADER = {
  encoded: {"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"},
  json: {"Content-Type": "application/json; charset=UTF-8"},
  text: {"Content-Type": "text/plain; charset=UTF-8"}
};

/*
// https options
const options = {
    key: readFileSync('ssl/magnet-search-form.key'),
    cert: readFileSync('ssl/magnet-search-form.crt'),
};

// dynamic request
const load = async () => {
    const result = await fetch(API);
    return (await result.json());
};
*/

TorrentSearchApi.enablePublicProviders();

const getMagnets = async (req, res) => {
  let {query, category, limit} = req.query;

  query = query || "";
  category = category || "All";
  limit = limit || 1;

  console.log(`\n\n GET \n query:  ${query}`);
  console.log(` category:  ${category}`);
  console.log(` limit:  ${limit}\n\n`);

  const result = await TorrentSearchApi.search(query, category, limit);

  send(res, STATUS.success, JSON.stringify(result));

  // const filtered = Array.from(result).filter(
  //    x => parseInt(x?.peers) >= 1 && parseInt(x?.seeds) >= 1
  // );
  // send(JSON.stringify(filtered), STATUS.success);
  // res.writeHead(STATUS.success, HEADER.json)
  // res.end(/* JSON.stringify(result) */)
};

const postMagnets = async (req, res) => {
  console.log("\n\n", req);

  if (!req.query) {
    // send(WARNING.empty, STATUS.empty);
    res.writeHead(STATUS.empty, HEADER.text);
    res.end(WARNING.empty);
  } else {
    try {
      // console.log(' \n query: ', JSON.stringify(req.query), ' \n ');

      let {query, category, limit} = req.query;

      query = query || "1080p";
      category = category || "Movies";
      limit = parseInt(limit, 10) || 1;

      console.log(`\n POST \n query:  ${query}`);
      console.log(` category:  ${category}`);
      console.log(` limit:  ${limit} \n `);

      const torrents = await TorrentSearchApi.search(query, category, limit);

      console.log(" \n torrents: ", torrents, " \n ");

      // const getMagnet = async (_torrent) => await TorrentSearchApi.getMagnet(_torrent);
      // const magnets = Array.from(torrents).map(torrent => getMagnet(torrent));
      // console.log(' \n magnets: ', magnets, ' \n ');

      send(res, 200, torrents);
    } catch (err) {
      send(res, 404);
    }
  }
};

// const { handler } =
server()
  .use(morgan(isDev ? "dev" : "tiny", {immediate: isDev}))
  .use(cors())
  .use(cookieParser())
  .use(json())
  .get("/magnets", getMagnets)
  .post("/magnets", postMagnets)
  .use(serve)
  .listen(PORT || 5000, () => {
    if (isDev) {
      console.log(`API is now running on ${HOST}:${PORT}${API}`);
    }
  });

/*
createServer(options, handler).listen(PORT, (err) => {
  if (err) { throw err; }
  else { console.log(`Server running on localhost:${PORT}`); }
});
*/
