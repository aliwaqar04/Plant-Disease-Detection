import { useEffect, useState } from "react";
import { api } from "../services/api";
import ImageUploader from "../components/ImageUploader";
import PredictionCard from "../components/PredictionCard";

export default function Detection() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [info, setInfo] = useState(null);

  // Free the old preview URL whenever it changes or the page closes.
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

  function handleSelect(f) {
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResult(null);
    setInfo(null);
    setError("");
  }

  async function analyze() {
    setLoading(true);
    setError("");
    setResult(null);
    setInfo(null);
    try {
      const form = new FormData();
      form.append("file", file);
      const { data } = await api.post("/predict", form);
      setResult(data);
      try {
        const res = await api.get(`/diseases/${encodeURIComponent(data.predicted_class)}`);
        setInfo(res.data);
      } catch {
        // disease information is optional; the prediction is still shown
      }
    } catch (err) {
      const detail = err.response?.data?.detail;
      setError(
        typeof detail === "string"
          ? detail
          : "Could not reach the server. Is the backend running?"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <h1>Disease Detection</h1>
      <p className="subtitle">
        Upload a photo of a tomato, potato or bell pepper leaf.
      </p>

      <div className="card">
        <ImageUploader
          preview={preview}
          onSelect={handleSelect}
          onError={setError}
          disabled={loading}
        />
        <div className="actions">
          <button className="btn" disabled={!file || loading} onClick={analyze}>
            {loading ? "Analyzing…" : "Analyze"}
          </button>
        </div>
        {error && <div className="error">{error}</div>}
      </div>

      {result && <PredictionCard result={result} info={info} />}
    </>
  );
}