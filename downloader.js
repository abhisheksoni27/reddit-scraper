const fs = require("fs");
const flatten = require("lodash.flatten");
const { donwloadAndSaveSubreddit } = require("./api");

const mappings = JSON.parse(
  fs.readFileSync("categoryMappings.json").toString()
);

const mappingNames = Object.keys(mappings);

let subreddits = [];

mappingNames.forEach(name => {
  const mappingContent = mappings[name];
  const subMappings = Object.keys(mappingContent);
  subMappings.forEach(subreddit => {
    subreddits.push({ name: subreddit, count: mappingContent[subreddit] });
  });
});

subreddits = flatten(subreddits);

async function processArray(array) {
  for (const subreddit of array) {
    console.log("TCL: processArray -> subreddit", subreddit)
    await donwloadAndSaveSubreddit(subreddit.name, subreddit.count);
  }
  console.log("Done!");
}

processArray(subreddits);
