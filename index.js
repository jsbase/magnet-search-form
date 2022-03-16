const { join } = require('path'),
    polka = require('polka'),
    send = require('@polka/send'),
    cors = require('cors'),
    morgan = require('morgan'),
    cookieParser = require('cookie-parser'),
    { json } = require('body-parser'),
    TorrentSearchApi = require('torrent-search-api'),
    dir = join(__dirname, 'public'),
    serve = require('serve-static')(dir),
    STATUS = { success: 200, fail: 404 },
    PORT = process.env.PORT || 3000;

TorrentSearchApi.enablePublicProviders();

const getMagnets = async (req, res) => {
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
//    filtered = Array.from(results).filter((x) => parseInt(x?.peers) >= 1 && parseInt(x?.seeds) >= 1);

    send(STATUS.success, JSON.stringify(results));
    /*    
    res.writeHead(STATUS.success, {
        'Content-Type': 'application/json',
    });

    res.end(JSON.stringify(results));
    */
};

const postMagnets = async (req, res) => {
    let { payload } = req.body;
    payload = payload || {};

    console.log(`\n\n payload: `, payload);

    /* 
    query = payload.query || 'free';
    category = payload.category || 'all';
    limit = payload.limit || '25';
 
    console.log(`\n\n query:  ${query}`);
    console.log(` category:  ${category}`);
    console.log(` limit:  ${limit}\n\n`);
 
    const results = await TorrentSearchApi.search(query, category, limit);
    filtered = Array.from(results).filter((x) => parseInt(x?.peers) >= 1 && parseInt(x?.seeds) >= 1);
    */

    res.writeHead(STATUS.success, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(payload));
};

polka()
    .use(morgan('tiny'))
    .use(cors())
    .use(cookieParser())
    //.use(polka.urlencoded({ extended: true }))
    .use(json())
    .get('/get', getMagnets)
    .post('/post', postMagnets)
    .use(serve)
    .listen(PORT, (err) => {
        if (err) { throw err; }
        console.log('Server running on localhost:' + PORT);
    });
