const fetch = require("node-fetch");

class HttpError extends Error {
  constructor(response) {
    super(`${response.status} for ${response.url}`);
    this.name = "HttpError";
    this.response = response;
  }
}

// async request with node-fetch
/*
const load = async (url, opts) => {
    const data = await global.fetch(url, opts);
    const result = await result.json();
    return result;
};
*/

async function loadJson(url) {
  let response = await fetch(url);
  if (response.status == 200) {
    return response.json();
  } else {
    throw new HttpError(response);
  }
}

/**
 * @name asyncFetch
 * @description Ask for a user name until github returns a valid user
 * @usage asyncFetch(res, req, next)
 */
module.exports = async function asyncFetch(req, res) {
  let name = req.body.query || "jsbase";
  let user;
  
    try {
      user = await loadJson(`https://api.github.com/users/${name}`);
    } catch (err) {
      if (err instanceof HttpError && err.response.status == 404) {
        res.end("No such user, please reenter.");
      } else {
        res.end(err);
      }
    }
  
  res.send(200, user);
};
