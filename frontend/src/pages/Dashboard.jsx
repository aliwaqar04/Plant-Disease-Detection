import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import StatCard from "../components/StatCard";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/dashboard")
      .then((res) => setData(res.data))
      .catch(() => setError("Could not load the dashboard. Is the backend running?"));
  }, []);

  if (error) return <div className="error">{error}</div>;
  if (!data) return <div className="empty">Loading…</div>;

  const avg =
    data.average_confidence === null ? "–" : `${(data.average_confidence * 100).toFixed(1)}%`;

  return (
    <>
      <h1>Dashboard</h1>
      <p className="subtitle">An overview of the predictions made so far.</p>

      <div className="stats">
        <StatCard label="Total predictions" value={data.total_predictions} />
        <StatCard label="Healthy" value={data.healthy} />
        <StatCard label="Diseased" value={data.diseased} tone="diseased" />
        <StatCard label="Average model score" value={avg} note="not an accuracy figure" />
      </div>

      <div className="card">
        <h2>Recent detections</h2>
        {data.recent.length === 0 ? (
          <div className="empty">
            No predictions yet. <Link to="/">Analyze a leaf</Link> to get started.
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Plant</th>
                  <th>Condition</th>
                  <th>Status</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {data.recent.map((r) => (
                  <tr key={r.id}>
                    <td>{new Date(r.created_at).toLocaleString()}</td>
                    <td>{r.plant}</td>
                    <td>{r.disease}</td>
                    <td>
                      <span className={`badge ${r.health_status === "Healthy" ? "healthy" : "diseased"}`}>
                        {r.health_status}
                      </span>
                    </td>
                    <td>{(r.confidence * 100).toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}