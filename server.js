const { join } = require('path'),
    //{ createServer } = require('https'),
    //{ readFileSync } = require('fs'),
    server = require('polka'),
    //send = require('@polka/send'),
    cors = require('cors'),
    morgan = require('morgan'),
    cookieParser = require('cookie-parser'),
    { json } = require('body-parser'),
    dir = join(__dirname, 'public'),
    serve = require('serve-static')(dir),
    TorrentSearchApi = require('torrent-search-api');

const dev = process.env.NODE_ENV === 'development';

const PORT = process.env.PORT || 3000;

const STATUS = {
   success: 200,
   empty: 400,
   fail: 404,
};

const WARNING = {
    empty: 'Search query must not be empty!',
};

/*
// https options
const options = {
    key: readFileSync('ssl/magnet-search-form.key'),
    cert: readFileSync('ssl/magnet-search-form.crt'),
};

// dynamic request
const load = async (type) => {
    const result = await fetch(`${URL}/${type}`);
    return (await result.json());
};
*/

TorrentSearchApi.enablePublicProviders();

const getMagnets = async (req, res) => {
    let {
        query,
        category,
        limit,
    } = req.query;

    query = query || 'gimp';
    category = category || 'apps';
    limit = limit || '3';

    console.log(`\n\n GET \n query:  ${query}`);
    console.log(` category:  ${category}`);
    console.log(` limit:  ${limit}\n\n`);

    const result = await TorrentSearchApi.search(query, category, limit);
    filtered = Array.from(result).filter(
        x => parseInt(x?.peers) >= 1 && parseInt(x?.seeds) >= 1
    );

    // send(STATUS.success, JSON.stringify(filtered));

    res.writeHead(STATUS.success, {
        'Content-Type': 'application/json;charset=UTF-8',
    });

    res.end(JSON.stringify(filtered));
};

const postMagnets = async (req, res, next) => {
    console.log(`\n\n`, req, `\n`);

    if (!req.query) {
        //send(msg, STATUS.empty);

        res.writeHead(STATUS.empty, {
            'Content-Type': 'text/plain;charset=UTF-8',
        });

        res.end(WARNING.empty);
    } else {
        let {
            query,
            category,
    	    limit,
        } = req.query;

        query = query || 'gimp';
        category = category || 'apps';
        limit = limit || '3';

        console.log(`\n\n POST \n query:  ${query}`);
        console.log(` category:  ${category}`);
        console.log(` limit:  ${limit}\n\n`);

        const result = await TorrentSearchApi.search(query, limit);

        filtered = Array.from(result).filter(
            x => parseInt(x?.peers) >= 1 && parseInt(x?.seeds) >= 1
        );

        res.writeHead(STATUS.success, {
            // 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            'Content-Type': 'application/json;charset=UTF-8',
        });

        res.end(JSON.stringify(filtered));
    }
};

// const { handler } =
server()
    .use(morgan(
        dev ? 'dev' : 'short',
        { immediate: !!dev }
    ))
    .use(cors())
    .use(cookieParser())
    .use(json())
    .post('/magnets', postMagnets)
    .get('/magnets', getMagnets)
    .use(serve)
    .listen(PORT, err => {
        if (err) { console.error(err); }
        else { console.log(`Server running on localhost:${PORT}`); }
    });

/*
createServer(options, handler).listen(PORT, (err) => {
	if (err) { throw err; }
	else { console.log(`Server running on localhost:${PORT}`); }
});
*/
