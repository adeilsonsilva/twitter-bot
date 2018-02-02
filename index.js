var Dotenv = require('dotenv');
var Twit = require('twit');

Dotenv.load();

var T = new Twit({
    consumer_key:         process.env.TWITTER_CONSUMER_KEY,
    consumer_secret:      process.env.TWITTER_CONSUMER_SECRET,
    access_token:         process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret:  process.env.TWITTER_ACCESS_TOKEN_SECRET,
    timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
});

/**
 * Get latest tweet from hashtag
 */
T.get('search/tweets', { q: '#mata6420172', count: 10 }, function(err, data, response) {
    data["statuses"].map(function(tweet) {
        console.log(tweet.text);
    });
})
