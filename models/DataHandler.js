import Featurizer from '../vendor/Featurizer.js';

export default class DataHandler {

    constructor (filename, load = false) {
        this.filename = filename;
        this.filetype = this.filename.split('.').pop();
    }

    async setData () {
        this.data = await DataHandler.readFile(this.filename);
    }

    /**
     * Read JSON from file
     * @return {Object} [JSON data]
     */
    static async readFile (filename) {

        var fs = require('fs');

        return await new Promise((resolve, reject) => {
            fs.readFile(filename, 'utf8', function (err, data) {
                if (err) {reject(err)};
                resolve(JSON.parse(data));
            });
        });

    }

    /**
     * Save JSON data to file
     * @param  {[Object]}  data [JSON Object]
     * @return {Promise}      [JSON data]
     */
    static async saveFile (filename, data) {

        var fs = require('fs');

        return await new Promise((resolve, reject) => {
            fs.writeFile(filename, JSON.stringify(data), 'utf8', function(err) {
                if(err) {reject(err)};
            });
        });

    }

    async getTrainArray () {
        var result = [];

        await this.setData();
        this.data = this.data.slice(0, 10); // TODO: remove, is just for testing
        var sentences = [];
        var classes = [];

        this.data.map(function (item) {
            /**
             *  TODO: make sentence creation agnostic of file content.
             *  'SentimentText' here is the feature name from this daabase only
             */
            sentences.push(item.SentimentText);
            classes.push(item.Sentiment);
        });

        this.featurizer = new Featurizer(sentences);
        var features = this.featurizer.featurized;
        DataHandler.saveFile('./data/features.json', this.featurizer.combined);

        features.map(function (item, idx) {
            if (classes[idx] == 1) {
                result.push({input: item, output: { positivo: 1 } })
            } else {
                result.push({input: item, output: { negativo: 1 } })
            }
        });

        return result;
    }

    static async featurizeFromArray (text) {
        var features = await DataHandler.readFile('./data/features.json');
        return await Featurizer.featurizeFromArray(text, features);
    }

    featurize (text) {
        return this.featurizer.featurize(text);
    }

}
