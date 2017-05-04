const request = require('request');
const baseUri = "https://api.github.com";
const readline = require('readline');

const prompt = `
  Welcome to GitHuh
  where you can get github information

  following commands:
  githuh repos <username>
  githuh stars <username>
  githuh profile <username>
  quit
`

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt
});


class GitHuh {

  repos(username, callback) {
    return this._sendRequest('/repos', username, callback);
  };

  stars(username, callback) {
    this._sendRequest('/starred', username, callback);
  };

  profile(username, callback) {
    this._sendRequest('', username, callback);
  };

  _sendRequest(path, username, callback) {
    let url = `${baseUri}/users/${username}${path}`;

    var options = {
      url: url,
      headers: {
        'User-Agent': `${username}`
      }
    }

    request(options, callback);
  };
};


const githuh = new GitHuh();

const reposCallback = function(error, response, body) {
  JSON.parse(body).forEach(function(repo) {
    console.log(repo.name);
  });
  console.log("\n")
};

const starsCallback = function(error, response, body) {
  JSON.parse(body).forEach(function(stars) {
    console.log(stars.name);
  });
  console.log("\n")
};

const profileCallback = function(error, response, body) {
  const data = JSON.parse(body);
  console.log("Email: " + data.email);
  console.log("Public repos: " + data.public_repos);
  console.log("Followers: " + data.followers);
  console.log("Following: " + data.following);
  console.log("\n")
};


rl.prompt()
rl.on("line", (userInput) => {
  const command = parseCommand(userInput);
  const username = parseUsername(userInput);

  console.log("\n")

  switch (command) {
    case "githuh repos":
      return githuh.repos(username, reposCallback)
    case "githuh stars":
      return githuh.stars(username, starsCallback)
    case "githuh profile":
      return githuh.profile(username, profileCallback)
    case "quit":
      return rl.close()
    default:
      console.log("INVALID INPUT, TRY AGAIN");
      break;
  }

}).on('close', () => {
  console.log('Have a great day!');
  process.exit(0);
})

const parseCommand = function(userInput) {
  return userInput.split(" ").slice(0, 2).join(" ");
}

const parseUsername = function(userInput) {
  return userInput.split(" ")[2];
}
