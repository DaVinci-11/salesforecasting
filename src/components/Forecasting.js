import * as tf from "@tensorflow/tfjs";

export const forecastSales = (model, data) => {
  const { max, min } = data;

  const futureInputs = tf.tensor2d(
    Array.from({ length: 6 }, (_, i) => [i + 1, 0])
  );
  const predictions = model.predict(futureInputs).dataSync();

  return predictions.map((val) => val * (max - min) + min);
};
