const fs = require("fs");
const request = require("request-promise");
const flatten = require("lodash.flatten");
// read json first

const mappings = JSON.parse(
  fs.readFileSync("categoryMappings.json").toString()
);

const readCategoryThreads = async (subCategory, count = 1, sleepTime) => {
  await sleep(sleepTime);

  return new Promise((resolve, reject) => {
    const options = {
      uri: `https://api.pushshift.io/reddit/search/submission/?fields=id,url,selftext,title&subreddit=${subCategory}&score=>100&size=${count}`,
      headers: {
        "User-Agent": Math.random().toString()
      },
      json: true // Automatically parses the JSON string in the response
    };

    request(options)
      .then(resJson => {
        resolve(resJson.data);
      })
      .catch(err => reject(err));
  });
};

const masterCategories = Object.keys(mappings);

const apiPromises = {};

const sleep = async ms => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
};

for (let index = 0; index < masterCategories.length; index++) {
  const category = masterCategories[index];
  apiPromises[category] = [];
}

for (let index = 0; index < masterCategories.length; index++) {
  const category = masterCategories[index];

  const subCategories = mappings[category];

  const subCategoryNames = Object.keys(subCategories);

  for (let j = 0; j < subCategoryNames.length; j++) {
    const subCategory = subCategoryNames[j];
    const currSubCategoryCount = subCategories[subCategory];


    apiPromises[category].push(
      readCategoryThreads(
        subCategory,
        currSubCategoryCount,
        1000 * index * j
      )
    );
  }
}

masterCategories.forEach(category => {
  if (apiPromises[category]) {
    Promise.all(apiPromises[category]).then(allFeedData => {
      const flattened = flatten(allFeedData);
      const modified = flattened.map(post => {
        const { url, title, id, selftext } = post;
        return {
          url,
          title,
          id,
          selftext,
          completeText: selftext + "   " + title
        };
      });

      // save this against category name

      fs.writeFile(
        `categories/${category}.json`,
        JSON.stringify(modified),
        () => {}
      );
    });
  }
});
