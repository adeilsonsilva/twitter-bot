import Brain from 'brain.js';
import DataHandler from './DataHandler.js';

export default class NLP {

    constructor () {
        this.net = new Brain.NeuralNetwork({
            activation: 'sigmoid', // activation function
            learningRate: 0.6 // global learning rate, useful when training using streams
        });
        this.dataHandler = new DataHandler('./data/train.json');
    }

    async train (save = false) {

        var trainData = await this.dataHandler.getTrainArray();
        this.net.train(trainData, {
            iterations: 20000,    // the maximum times to iterate the training data
            errorThresh: 0.005,   // the acceptable error percentage from training data
            log: true,           // true to use console.log, when a function is supplied it is used
            logPeriod: 10,        // iterations between logging out
            learningRate: 0.3,    // scales with delta to effect traiing rate
            momentum: 0.1,        // scales with next layer's change value
            callback: null,       // a periodic call back that can be triggered while training
            callbackPeriod: 10,   // the number of iterations through the training data between callback calls
            timeout: 60000*5     // the max number of milliseconds to train for
        });

        // console.log(Brain.crossValidate(Brain.NeuralNetwork, trainData,
        //         {
        //             activation: 'sigmoid', // activation function
        //             learningRate: 0.6 // global learning rate, useful when training using streams
        //         },
        //         {
        //             iterations: 20000,    // the maximum times to iterate the training data
        //             errorThresh: 0.005,   // the acceptable error percentage from training data
        //             log: true,           // true to use console.log, when a function is supplied it is used
        //             logPeriod: 10,        // iterations between logging out
        //             learningRate: 0.3,    // scales with delta to effect traiing rate
        //             momentum: 0.1,        // scales with next layer's change value
        //             callback: null,       // a periodic call back that can be triggered while training
        //             callbackPeriod: 10,   // the number of iterations through the training data between callback calls
        //             timeout: 60000*5     // the max number of milliseconds to train for
        //         },
        //     10));

        if (save) {
            var timestamp = new Date().getTime();
            var trainingResult = this.net.toJSON();
            DataHandler.saveFile('./data/trainResult.json', trainingResult);
        }
    }

    async loadTrain () {
        var data = await DataHandler.readFile('./data/trainResult.json');
        this.net.fromJSON(data);
    }

    async classifyFromLoad (text) {
        var feature = await DataHandler.featurizeFromArray(text);
        return this.net.run(feature);
    }

    classify (text) {
        var feature = this.dataHandler.featurize(text);
        return this.net.run(feature);
    }
}
