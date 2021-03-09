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
