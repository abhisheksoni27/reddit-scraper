const fs = require("fs");
const flatten = require("lodash.flatten");

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

async function readAndPush(subreddit) {
  return new Promise((resolve, reject) => {
    fs.readFile(`raw/${subreddit}.json`, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
}

mappingNames.forEach(async (masterCategory, index) => {
  console.log("TCL: masterCategory", masterCategory, index);
  let result = [];
  const mappingContent = mappings[masterCategory];
  const subMappings = Object.keys(mappingContent);

  for (const subreddit of subMappings) {
    const data = await readAndPush(subreddit);
    result.push(JSON.parse(data.toString()));
  }
  result = flatten(result);
  fs.writeFile(
    `categories/${masterCategory}.json`,
    JSON.stringify(result),
    () => {}
  );
});
