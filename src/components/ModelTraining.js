import * as tf from "@tensorflow/tfjs";
export const trainModel = async (data) => {
  const { salesDate, productDescription, normalizedQuantity } = data;

  // Create tensors with explicit shape
  const inputs = tf.tensor2d(
    salesDate.map((date, index) => [date, productDescription[index]]), // Each row is a 2D array with 2 columns
    [salesDate.length, 2] // Shape: [number of samples, 2 features]
  );

  const outputs = tf.tensor2d(
    normalizedQuantity.map((value) => [value]), // Each output is a single value
    [normalizedQuantity.length, 1] // Shape: [number of samples, 1 output]
  );

  // Check tensor shapes
  console.log("Inputs shape:", inputs.shape);
  console.log("Outputs shape:", outputs.shape);

  if (inputs.shape[0] === 0 || outputs.shape[0] === 0) {
    throw new Error("No data available for training.");
  }

  // Define the model
  const model = tf.sequential();
  model.add(tf.layers.dense({ units: 8, inputShape: [2], activation: "relu" }));
  model.add(tf.layers.dense({ units: 1 }));
  model.compile({ optimizer: "adam", loss: "meanSquaredError" });

  // Train the model
  await model.fit(inputs, outputs, { epochs: 50, batchSize: 10 });
  return model;
};
