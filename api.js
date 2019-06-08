const fs = require("fs");
const flatten = require("lodash.flatten");
const request = require("request-promise");
const MAX_PER_BATCH = 500;

const sleep = async ms => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
};

const readBatchedThreads = async (
  subreddit,
  count = 1,
  beforeTime,
  sleepTime
) => {
  await sleep(sleepTime);

  return new Promise((resolve, reject) => {
    const options = {
      uri: `https://api.pushshift.io/reddit/search/submission/?fields=id,url,selftext,title,created_utc&subreddit=${subreddit}&score=>00&size=${count}&before=${beforeTime}`,
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

const createBatchChunks = count => {
  const batchChunks = [];
  let copiedCount = count;
  while (copiedCount > 0) {
    if (copiedCount > MAX_PER_BATCH) {
      batchChunks.push(MAX_PER_BATCH);
      copiedCount -= MAX_PER_BATCH;
    } else {
      batchChunks.push(copiedCount);
      copiedCount -= copiedCount;
    }
  }
  return batchChunks;
};

const readThreads = async (subreddit, totalCount = 1000) => {
  const batchChunks = createBatchChunks(totalCount);
  console.log("Chunks created", batchChunks);
  const submissions = [];
  let beforeTime = new Date().getTime();
  for (let i = 0; i < batchChunks.length; i++) {
    console.log(`Processing chunk ${i} = `, batchChunks[i]);
    const curBatchCount = batchChunks[i];
    const posts = await readBatchedThreads(
      subreddit,
      curBatchCount,
      beforeTime,
      (i + 1) * 300 * Math.random()
    );
    console.log(`Done with chunk ${i} = `, batchChunks[i]);

    beforeTime = posts[posts.length - 1].created_utc;
    submissions.push(posts);
  }

  console.log("TCL: readThreads -> submissions", flatten(submissions).length);
  return flatten(submissions);
};

const donwloadAndSaveSubreddit = async(subreddit, count) => {
  await readThreads(subreddit, count).then(data => {
    fs.writeFile(`raw/${subreddit}.json`, JSON.stringify(data), () => { });
    return null;
  });
};

module.exports = { donwloadAndSaveSubreddit };
