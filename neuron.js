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
