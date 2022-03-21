const fetch = require('./node-fetch-mod');
const server = require('polka');
const send = require('@polka/send-type');
const morgan = require('morgan');
const cors = require('cors');
const parser = require('body-parser');
const sirv = require('sirv');
// const { crud } = require('./crud');

const { PORT = 3000 } = process.env;
const API = 'https://api.github.com';

server()
    .use(cors())
    .use(morgan('combined'))
	.use(sirv('public'))
	.use(parser.json())
	.post('/magnets', async (req, res) => {
        try {
            console.log(JSON.stringify(req.query));

            const data = await fetch(`${API}/users`);
            // const data = {
            //    json: async () => (Promise.resolve({ "one": "two" }))
            // };
            const result = await data.json();

            send(res, 200, result);
        } catch(err) {
            send(res, 404);
        }

        /* res.writeHead(200, {
		   'content-type': 'application/json; charset=UTF-8'
		});

        let json = JSON.stringify(req.query);
		res.end(json); */
	})
	.listen(PORT, () => {
		console.log(`> Running on localhost:${PORT}`);
	});
