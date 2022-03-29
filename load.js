/* eslint-disable no-undef */
const fetch = require("node-fetch");

// async request with node-fetch
/*
const load = async (url, opts) => {
    const data = await global.fetch(url, opts);
    const result = await result.json();
    return result;
};
*/

class HttpError extends Error {
  constructor(response) {
    super(`${response.status} for ${response.url}`);
    this.name = "HttpError";
    this.response = response;
  }
}

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
 * @usage demoGithubUser()
 */
module.exports = async function asyncFetch() {
  let user;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    let name = prompt("Enter a name?", "iliakan");

    try {
      user = await loadJson(`https://api.github.com/users/${name}`);
      break; // no error, exit loop
    } catch (err) {
      if (err instanceof HttpError && err.response.status == 404) {
        alert("No such user, please reenter.");
      } else {
        throw err;
      }
    }
  }

  alert(`Full name: ${user.name}.`);
  return user;
};
