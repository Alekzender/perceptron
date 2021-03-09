class Net {
  inputLayer;
  hiddenLayers = [];
  outputLayer;

  constructor(amountOfInputNeyrons, amountOfHiddenlayersNeyrons, amountOfOutputNeyrons) {
    this.inputLayer = new Layer(amountOfInputNeyrons, amountOfInputNeyrons,  true);

    if (!Array.isArray(amountOfHiddenlayersNeyrons) || amountOfHiddenlayersNeyrons.length < 1) {
      throw Error('Invalid hidden layers configuration');
    }

    for(let i = 0; i < amountOfHiddenlayersNeyrons.length; i++) {
      const amountOfInputs = i > 0 ? amountOfHiddenlayersNeyrons[i - 1] : this.inputLayer.neurons.length;
      this.hiddenLayers[i] = new Layer(amountOfHiddenlayersNeyrons[i], amountOfInputs);
    }

    const lastHiddenLayer = this.hiddenLayers[amountOfHiddenlayersNeyrons.length - 1];
    this.outputLayer = new Layer(amountOfOutputNeyrons, lastHiddenLayer.neurons.length);
  }

  input(input) {
    if (!Array.isArray(input) || input.length !== this.inputLayer.neurons.length) {
      throw Error('Invalid input for Net')
    }

    const inputResult = this.inputLayer.input(input);
    let lastHiddenLayerResult = inputResult;
    this.hiddenLayers.forEach(hiddenLayer => lastHiddenLayerResult = hiddenLayer.input(lastHiddenLayerResult));
    return this.outputLayer.input(lastHiddenLayerResult);
  }

  learn(delta) {
    this.hiddenLayers.forEach(hidden => hidden.learn(delta));
    this.outputLayer.learn(delta);
  }
}
