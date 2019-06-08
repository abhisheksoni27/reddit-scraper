In a file named `config.json`, store the subreddits that you want to fetch, along with how many submissions you want to fetch from that.

The system will batch your requests and only fetch max of 300 posts every API call.

These posts will be aggregated and then saved at last under the name: SUBREDDITNAME.json