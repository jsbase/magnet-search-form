const { join } = require('path'),
    { createServer } = require('https'),
    { readFileSync } = require('fs'),
    server = require('polka'),
    //send = require('@polka/send'),
    cors = require('cors'),
    morgan = require('morgan'),
    cookieParser = require('cookie-parser'),
    { json } = require('body-parser'),
    dir = join(__dirname, 'public'),
    serve = require('serve-static')(dir),
    TorrentSearchApi = require('torrent-search-api').enablePublicProviders();

const PORT = process.env.PORT || 3000;

const STATUS = {
   success: 200,
   empty: 400,
   fail: 404,
};
    
const options = {
    key: readFileSync('ssl/magnet-search-form.key'),
    cert: readFileSync('ssl/magnet-search-form.crt'),
};

/*
const load = async (type) => {
    const result = await fetch(`${URL}/${type}`);
    return (await result.json());
};
*/

const getMagnets = async (req, res) => {
    let {
        query,
        category,
        limit,
    } = req.query;

    query = query || 'manjaro';
    category = category || 'apps';
    limit = limit || '3';

    console.log(`\n\n query:  ${query}`);
    console.log(` category:  ${category}`);
    console.log(` limit:  ${limit}\n\n`);

    const result = (await TorrentSearchApi.search(query, category, limit));
    //filtered = Array.from(results).filter((x) => parseInt(x?.peers) >= 1 && parseInt(x?.seeds) >= 1);

    // send(STATUS.success, JSON.stringify(result));

    res.writeHead(STATUS.success, {
        'Content-Type': 'application/json',
    });

    res.end(JSON.stringify(results));
};

const postMagnets = async (req, res) => {
    if (!req.body || !req.body.query) {
        const msg = {
            message: "Content can not be empty!",
        };

        //send(msg, STATUS.empty);

        res.writeHead(STATUS.empty, {
            'Content-Type': 'application/json',
        });

        res.end(JSON.stringify(msg));
    } else {
        let {
            query,
            category,
    	    limit,
        } = req.body;

        query = query || 'manjaro';
        category = category || 'apps';
        limit = limit || '3';

        console.log(`\n\n query:  ${query}`);
        console.log(` category:  ${category}`);
        console.log(` limit:  ${limit}\n\n`);

        const result = (
            await TorrentSearchApi.search(query, limit)
        );

        //filtered = Array.from(results).filter((x) => parseInt(x?.peers) >= 1 && parseInt(x?.seeds) >= 1);

        res.writeHead(STATUS.success, {
            'Content-Type': 'application/json',
        });

        res.end(JSON.stringify(result));
    }
};

const { handler } = server()
    .use(morgan('tiny'))
    .use(cors())
    .use(cookieParser())
    //.use(polka.urlencoded({ extended: true }))
    .use(json())
    .get('/get', getMagnets)
    .post('/post', postMagnets)
    .use(serve);

createServer(options, handler).listen(PORT, (err) => {
	if (err) { throw err; }

	console.log(`Server running on localhost:${PORT}`);
});
