import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { api } from "../services/api";

const GREEN = "#3a8247";
const RED = "#b3261e";

export default function Statistics() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/dashboard")
      .then((res) => setData(res.data))
      .catch(() => setError("Could not load statistics. Is the backend running?"));
  }, []);

  if (error) return <div className="error">{error}</div>;
  if (!data) return <div className="empty">Loading…</div>;

  if (data.total_predictions === 0) {
    return (
      <>
        <h1>Statistics</h1>
        <div className="card empty">
          No predictions yet. <Link to="/">Analyze a leaf</Link> to see statistics.
        </div>
      </>
    );
  }

  const pie = [
    { name: "Healthy", value: data.healthy },
    { name: "Diseased", value: data.diseased },
  ];
  const frequency = data.disease_frequency.map((d) => ({
    name: `${d.plant} – ${d.disease}`,
    count: d.count,
  }));

  return (
    <>
      <h1>Statistics</h1>
      <p className="subtitle">
        Based on {data.total_predictions} prediction{data.total_predictions === 1 ? "" : "s"}.
      </p>

      <div className="chart-grid">
        <div className="card">
          <h2>Healthy vs diseased</h2>
          <div className="chart-box">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pie} dataKey="value" nameKey="name" outerRadius={90} label>
                  <Cell fill={GREEN} />
                  <Cell fill={RED} />
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h2>Disease frequency</h2>
          {frequency.length === 0 ? (
            <div className="empty">No diseased leaves detected yet.</div>
          ) : (
            <div className="chart-box">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={frequency} layout="vertical" margin={{ left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" allowDecimals={false} />
                  <YAxis type="category" dataKey="name" width={140} />
                  <Tooltip />
                  <Bar dataKey="count" fill={RED} name="Detections" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      <div className="card" style={{ marginTop: "1rem" }}>
        <h2>Predictions per day (last 30 days, UTC)</h2>
        <div className="chart-box">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.daily_trend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke={GREEN} name="Predictions" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}