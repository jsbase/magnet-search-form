const { join } = require('path'),
    polka = require('polka'),
    cookieParser = require('cookie-parser'),
    morgan = require('morgan'),
    cors = require('cors'),
    { json } = require('body-parser'),
    TorrentSearchApi = require('torrent-search-api'),
    dir = join(__dirname, 'public'),
    serve = require('serve-static')(dir),
    STATUS = { success: 200, fail: 404 },
    PORT = process.env.PORT || 3000;

TorrentSearchApi.enablePublicProviders();

const getTorrents = async (req, res) => {
    console.log('GET: ', req);

    let {
        query,
        category,
        limit
    } = req.query;

    query = query || 'free';
    category = category || 'all';
    limit = limit || '25';

    console.log(`\n\n query:  ${query}`);
    console.log(` category:  ${category}`);
    console.log(` limit:  ${limit}\n\n`);

    const results = await TorrentSearchApi.search(query, category, limit);
    filtered = Array.from(results).filter((x) => parseInt(x?.peers) >= 1 && parseInt(x?.seeds) >= 1);

    res.writeHead(STATUS.success, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(filtered));
};

const postTorrents = async (req, res) => {
    console.log('POST: ', req);

     const payload = JSON.parse(req.body);
 
    query = payload.query || 'free';
    category = payload.category || 'all';
    limit = payload.limit || '25';
 
    console.log(`\n\n query:  ${query}`);
    console.log(` category:  ${category}`);
    console.log(` limit:  ${limit}\n\n`);
 
    const results = await TorrentSearchApi.search(query, category, limit);
    filtered = Array.from(results).filter((x) => parseInt(x?.peers) >= 1 && parseInt(x?.seeds) >= 1);
 
    res.writeHead(STATUS.success, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(filtered));
};

polka()
    .use(cors())
    .use(json())
    .get('/torrents', getTorrents)
    .post('/torrents', postTorrents)
    .use(serve)
    .use(cookieParser())
    .use(morgan('tiny'))
    .listen(PORT, (err) => {
        if (err) {
            throw err;
        }
        console.log('Server running on localhost:' + PORT);
    });
