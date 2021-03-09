class Neuron {
  weights = [];
  constructor(inputCount) {
    if (inputCount > 1) {
      for(let i = 0; i < inputCount; i++) {
        this.weights[i] = Math.random() * 2 - 1; // -1 - 1
      }
    } else {
      this.weights = [1];
    }
  }

  input(input) {
    if (this.weights.length === 1 && typeof input === 'number') {
      return input;
    }

    if (!Array.isArray(input) || input.length === this.weights) {
      throw Error('Invalid input');
    }

    const transformedValues = this.weights.map((weight, index) => weight * input[index]);
    const sum = transformedValues.reduce((acc, el) => { return acc + el }, 0);

    return this.activator(sum);
  }

  activator(value) {
    return 1 / (1 + Math.exp(-value));
  }

  correctWeights(delta) {
    console.log('weights before', this.weights.toString());
    this.weights.forEach((weight, index) => {
      const isNegative = Math.round(Math.random()) === 0;
      isNegative && (delta = -delta);
      this.weights[index] = weight + delta;
    });
    console.log('weights after', this.weights.toString());
  }
}

class Layer {
  neurons = [];
  amountOfNeuronInputs;
  isInputLayer = true;

  constructor(amountOfNeurons, amountOfNeuronInputs, isInputLayer) {
    this.amountOfNeuronInputs = amountOfNeuronInputs;
    this.isInputLayer = !!isInputLayer;

    if (this.isInputLayer) {
      for(let i = 0; i < amountOfNeurons; i++) {
        this.neurons[i] = new Neuron(1);
      }
    } else {
      for(let i = 0; i < amountOfNeurons; i++) {
        this.neurons[i] = new Neuron(amountOfNeuronInputs);
      }
    }
  }

  input(inputs) {
    if (this.isInputLayer) {
      if (inputs.length !== this.neurons.length) {
        throw Error('Invalid input for input layer')
      }
      return this.neurons.map((neuron, index) => {
        const res = this.neurons[index].input(inputs[index])
        return res;
      });
    }

    if (!Array.isArray(inputs) || inputs.length !== this.amountOfNeuronInputs) {
      throw Error('Invalid input for layer');
    }

    return this.neurons.map(neuron => {
      return neuron.input(inputs);
    });
  }

  learn(delta) {
    this.neurons.forEach(neuron => neuron.correctWeights(delta));
  }
}

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
