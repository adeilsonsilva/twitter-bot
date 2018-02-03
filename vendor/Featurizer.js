/**
* nina2017
* Node Interactive North America 2017 interactive presentation slides
* @repo {[https://github.com/mysamai/nina2017]}
*/

import flatten from 'lodash/flatten';
import uniq from 'lodash/uniq';
import PorterStemmer from 'natural/lib/natural/stemmers/porter_stemmer'

const stem = (sentence, keepStops = true) => {
    return PorterStemmer.tokenizeAndStem(
        sentence.toLowerCase(), keepStops
    );
};

export default class Featurizer {
    /**
     * Constructor
     * @param {[Array]} sentences [Array with strings to build]
     */
    constructor (sentences) {
        this.sentences = sentences;
    }

    get combined () {
        return uniq(flatten(this.sentences.map(
            current => stem(current)
        )));
    }

    get stems () {
        return this.sentences.map(
            current => stem(current)
        );
    }

    get featurized () {
        return this.stems.map(current =>
            this.featurize(current)
        );
    }

    static async featurizeFromArray (content, combined) {
        const tokens = typeof content === 'string' ?  await stem(content) : content;

        return combined.map(current =>
            tokens.indexOf(current) === -1 ? 0 : 1
        );
    }

    featurize (content) {
        const tokens = typeof content === 'string' ? stem(content) : content;

        return this.combined.map(current =>
            tokens.indexOf(current) === -1 ? 0 : 1
        );
    }
};

Featurizer.stem = stem;
