import React, { useState } from "react";
import FileUpload from "./components/FileUpload";
import Visualization from "./components/Visualization";
import { preprocessData } from "./components/DataPreprocessing";
import { trainModel } from "./components/ModelTraining";
import { forecastSales } from "./components/Forecasting";

const App = () => {
  const [data, setData] = useState(null);
  const [model, setModel] = useState(null);
  const [predictedSales, setPredictedSales] = useState([]);
  const [desiredProduct, setDesiredProduct] = useState("");
  const [availableProducts, setAvailableProducts] = useState([]);

  const handleDataLoaded = (rawData) => {
    const processedData = preprocessData(rawData);
    const uniqueProducts = Array.from(
      new Set(rawData.map((row) => row.product_description))
    );
    setAvailableProducts(uniqueProducts);
    setData(processedData);
  };

  const handleTrainModel = async () => {
    try {
      if (!data || !desiredProduct) {
        alert("Please upload data and enter a valid product name.");
        return;
      }

      const productIndex = availableProducts.indexOf(desiredProduct);
      if (productIndex === -1) {
        alert(
          `The product "${desiredProduct}" does not exist in the uploaded data.`
        );
        return;
      }

      const filteredData = {
        ...data,
        productDescription: data.productDescription.filter(
          (desc, index) => desc === productIndex
        ),
        salesDate: data.salesDate.filter(
          (_, index) => data.productDescription[index] === productIndex
        ),
        normalizedQuantity: data.normalizedQuantity.filter(
          (_, index) => data.productDescription[index] === productIndex
        ),
      };

      const trainedModel = await trainModel(filteredData);
      setModel(trainedModel);

      const predictions = forecastSales(trainedModel, filteredData);
      setPredictedSales(predictions);
    } catch (error) {
      console.error("Error during training:", error);
    }
  };

  return (
    <div>
      <h1>Adesa - Sales Forecasting</h1>
      <FileUpload onDataLoaded={handleDataLoaded} />

      <div>
        <label>Enter Product Name: </label>
        <input
          type="text"
          value={desiredProduct}
          onChange={(e) => setDesiredProduct(e.target.value)}
        />
      </div>

      <button onClick={handleTrainModel}>Train Model</button>

      {data && (
        <Visualization
          actualData={data.normalizedQuantity.map(
            (val) => val * (data.max - data.min) + data.min
          )}
          predictedData={predictedSales}
        />
      )}
    </div>
  );
};

export default App;
