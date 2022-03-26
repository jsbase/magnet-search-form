const server = require("polka");
const send = require("@polka/send-type");
const morgan = require("morgan");
const cors = require("cors");
const parser = require("body-parser");
const sirv = require("sirv");
const TorrentSearchApi = require("torrent-search-api");
// const { crud } = require('./crud');

const {PORT = 3000} = process.env;

TorrentSearchApi.enablePublicProviders();

server()
  .use(cors())
  .use(morgan("combined"))
  .use(sirv("public"))
  .use(parser.json())
  .post("/magnets", async (req, res) => {
    try {
      let {query = "1080p", category = "All", limit = 1} = req.body;

      console.log(`\n 
                [ POST ]\n
                query:  ${query}\n
                category:  ${category}\n
                limit:  ${limit}\n
            `);

      const torrents = await TorrentSearchApi.search(query, category, limit);

      console.log(`\n
                torrents: ${JSON.stringify(torrents)}
            \n`);

      // const getMagnet = async (_torrent) => await TorrentSearchApi.getMagnet(_torrent);
      // const magnets = Array.from(torrents).map(torrent => getMagnet(torrent));
      // console.log(' \n magnets: ', magnets, ' \n ');

      send(res, 200, torrents);
    } catch (err) {
      send(res, 404);
    }
  })
  .listen(PORT, () => {
    console.log(`> Running on localhost:${PORT}`);
  });
