import NLP from './models/NLP.js';

async function test () {
    var nlp = new NLP();
    // await nlp.train(true);
    await nlp.loadTrain();
    await nlp.classifyFromLoad("i love this game!");
    // nlp.classify("i love this game!");
}


test();
