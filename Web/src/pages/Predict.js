import axios from "axios";
import React, { useEffect, useState } from "react";
import UploadFile from "../components/UploadFile";
import { diabeticFootUlcers } from "../utils/sick";
import "./Predict.css";

const Predict = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(false);

  const handleSubmit = async () => {
    if (!file) {
      alert("Please upload a file first.");
      return;
    }
    setLoading(true);
    setPrediction(null);
    setError(false);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "https://b56e-34-82-172-8.ngrok-free.app/",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log("Response data from backend:", response.data);
      setPrediction(response.data);
    } catch (err) {
      console.error("Error occurred while predicting:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const retry = () => {
    setFile(null);
    setPrediction(null);
    setError(false);
  };

  // Map label from backend to match the `id` in `sick.js`
  const mappedLabel = prediction?.label ? parseInt(prediction.label, 10) : null;
  console.log("Mapped Label (mapped to sick.js):", mappedLabel);

  const result = mappedLabel !== null
    ? diabeticFootUlcers.find((item) => item.id === mappedLabel)
    : null;

  console.log("Result object (matched from sick.js):", result);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="predict-page">
      <h1 className="page-title">Predict</h1>
      <div className="predict-container">
        <div className="content">
          <UploadFile
            setFile={setFile}
            file={file}
            handleSubmit={handleSubmit}
            retry={retry}
            loading={loading}
          />
          <div className="result-section">
            {loading && <p>Loading...</p>}
            {!loading && prediction && result && (
              <div className="result">
                <h2>Prediction Result</h2>
                <h4>Diagnosed:</h4>
                <p>{result.label}</p>
                <h4>Causes:</h4>
                <p>{result.cause}</p>
                <h4>Effects:</h4>
                <p>{result.effect}</p>
                <h4>Signs:</h4>
                <ul>
                  {result.signs.map((sign) => (
                    <li key={sign.id}>{sign.content}</li>
                  ))}
                </ul>
                <h4>Prevention:</h4>
                <ul>
                  {result.avoid.map((avoid) => (
                    <li key={avoid.id}>{avoid.content}</li>
                  ))}
                </ul>
              </div>
            )}
            {!loading && prediction && !result && (
              <p>No matching result found for the given prediction.</p>
            )}
            {!loading && !prediction && !error && (
              <p>Please upload a photo and click "Predict".</p>
            )}
            {!loading && error && (
              <p>Error! Please try again or upload another file.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Predict;