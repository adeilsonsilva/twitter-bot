import NLP from './models/NLP.js';
import Twitter from './models/Twitter.js';

const express = require('express');
const  bodyParser = require('body-parser');

const app = express();
const nlp = new NLP();
const twitter = new Twitter();

async function init () {
    // await nlp.loadTrain();
    await nlp.train(true);
}

async function classify (text) {
    // return await nlp.classifyFromLoad(text);
    return await nlp.classify(text);
}

var middleware = function (req, res, next) {
    console.log('url: ' + req.url + ', method: ' + req.method);
    console.log('body: ' + JSON.stringify(req.body));
    next();
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(middleware);
app.set('view engine', 'pug');

app.get('/', function (req, res) {
    res.render('index', { title: 'MATA64 Tweet Bot', message: 'Write a message!', result: {positive: 0, negative: 0}, aux: {} })
})

app.get('/tweets', function (req, res) {
    res.render('tweets', { title: 'MATA64 Tweet Bot', message: 'Fetch from twitter!', results: [] })
})

app.post('/tweets', async function (req, res) {
    var tweets = await twitter.getTweets(JSON.stringify(req.body.hashtag));

    var promises = tweets.map( (tweet) => {
        return classify(tweet.text).then(
            (result) => {
                tweet.result = result;
                return tweet;
            }
        ).catch( (err) => {console.log(err) } );
    });

    await Promise.all(promises).then( function(results) {
        tweets = results;
    })

    tweets.map( (tweet) => {
        tweet.positivo = tweet.result.positivo > tweet.result.negativo ? 1 : undefined;
        tweet.negativo = tweet.result.negativo > tweet.result.positivo ? 1 : undefined;
        return tweet;
    });

    res.render('tweets', { title: 'MATA64 Tweet Bot', message: 'Fetch from twitter!', results: tweets })
})

app.post('/', async function (req, res) {
    var result = await classify(JSON.stringify(req.body.text));
    console.log(result);
    var aux = {};
    aux.positivo = result.positivo > result.negativo ? 1 : undefined;
    aux.negativo = result.negativo > result.positivo ? 1 : undefined;
    res.render('index', { title: 'MATA64 Tweet Bot', message: JSON.stringify(req.body.text), result: result, aux: aux })
})

app.listen(3000, async () => {
    await init();
    console.log('App listening on port 3000.')
});
