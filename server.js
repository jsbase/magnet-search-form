const { join } = require('path')
// { createServer } = require('https'),
// { readFileSync } = require('fs'),
const server = require('polka')
// send = require('@polka/send'),
const cors = require('cors')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const { json } = require('body-parser')
const dir = join(__dirname, 'public')
const serve = require('serve-static')(dir)
const TorrentSearchApi = require('torrent-search-api')

const { API, HOST, PORT, NODE_ENV } = process.env
const isDev = NODE_ENV === 'development'
const STATUS = { success: 200, empty: 400, fail: 404 }
const WARNING = { empty: 'Search query must not be empty!' }
const HEADER = {
  json: { 'Content-Type': 'application/json' },
  text: { 'Content-Type': 'text/plain' }
}

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

TorrentSearchApi.enablePublicProviders()

const getMagnets = async (req, res) => {
  let { query, category, limit } = req.query

  query = query || 'all'
  category = category || 'apps'
  limit = limit || '3'

  console.log(`\n\n GET \n query:  ${query}`)
  console.log(` category:  ${category}`)
  console.log(` limit:  ${limit}\n\n`)

  const result = (await TorrentSearchApi.search(query, category, limit))

  // const filtered = Array.from(result).filter(
  //    x => parseInt(x?.peers) >= 1 && parseInt(x?.seeds) >= 1
  // );
  // send(JSON.stringify(filtered), STATUS.success);

  res.writeHead(STATUS.success, HEADER.json)
  res.end(JSON.stringify(result))
}

const postMagnets = async (req, res) => {
  console.log('\n\n', req)

  if (!req.query) {
    // send(WARNING.empty, STATUS.empty);
    res.writeHead(STATUS.empty, HEADER.text)
    res.end(WARNING.empty)
  } else {
    let { query, category, limit } = req.query

    query = query || 'all'
    category = category || 'apps'
    limit = limit || '3'

    console.log(`\n\n POST \n query:  ${query}`)
    console.log(` category:  ${category}`)
    console.log(` limit:  ${limit}\n\n`)

    const result = (await TorrentSearchApi.search(query, limit))

    // const filtered = Array.from(result).filter(
    //    x => parseInt(x?.peers) >= 1 && parseInt(x?.seeds) >= 1
    // );

    res.writeHead(STATUS.success, HEADER.json)
    res.end(JSON.stringify(result))
  }
}

// const { handler } =
server()
  .use(morgan(isDev ? 'dev' : 'tiny', { immediate: isDev }))
  .use(cors())
  .use(cookieParser())
  .use(json())
  .get('/magnets', getMagnets)
  .post('/magnets', postMagnets)
  .use(serve)
  .listen(PORT || 5000, () => {
    if (isDev) {
      console.log(`API is now running on ${HOST}:${PORT}${API}`)
    }
  })

/*
createServer(options, handler).listen(PORT, (err) => {
  if (err) { throw err; }
  else { console.log(`Server running on localhost:${PORT}`); }
});
*/
