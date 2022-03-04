const { join } = require('path'),
    { json } = require('body-parser'),
    polka = require('polka'),
    cookieParser = require('cookie-parser'),
    morgan = require('morgan'),
    TorrentSearchApi = require('torrent-search-api'),
    dir = join(__dirname, 'public'),
    serve = require('serve-static')(dir),
    STATUS = { success: 200, fail: 404 },
    PORT = process.env.PORT || 3000;

TorrentSearchApi.enablePublicProviders();

const getTorrents = async (req, res) => {
    let {
        query,  
        category,
        limit
    } = req.query;

    query = query || '';
    category = category || '';
    limit = limit || '';

    console.log(` ---  query  -->  ${query}`);
    console.log(` ---  category  -->  ${category}`);
    console.log(` ---  limit  -->  ${limit}`);
    
    const results = await TorrentSearchApi.search(query, category, limit);
    filtered = Array.from(results).filter((x) => parseInt(x?.peers) >= 1 && parseInt(x?.seeds) >= 1);

    console.log('   -> filtered: ', filtered);

    res.writeHead(STATUS.success, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(filtered));
};

/* const getTorrents = async (req, res) => {
    const {  
        query,  
        category,
        limit
    } = req.query;

    console.log(` ---  query  -->  ${query}`);
    console.log(` ---  category  -->  ${category}`);
    console.log(` ---  limit  -->  ${limit}`);

    const results = await TorrentSearchApi.search(
        query || '',
        category || 'All',
        limit || '10'
    );

    //const filtered = Array.from(results).filter((x) => parseInt(x?.peers) >= 1 && parseInt(x?.seeds) >= 1);
    //const torrents = JSON.stringify(filtered);
    
    const torrents = JSON.stringify(results);

    res.writeHead(STATUS.success, { 'Content-Type': 'application/json' });
    res.end(torrents);  
}; */

polka()
    .use(json())
    .use(cookieParser())
    .use(morgan('dev'))
    .use(serve)
    //.get('/torrents', getTorrents)
    .get('/torrents', getTorrents)
    .listen(PORT, (err) => {
        if (err) {
            throw err;
        }
        console.log('Server running on localhost:' + PORT);
    });
