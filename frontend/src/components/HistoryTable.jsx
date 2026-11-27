import { Fragment, useState } from "react";

function prettyClass(name) {
  const [plant, disease] = name.split("___");
  return `${plant.replaceAll("_", " ")} – ${disease.replaceAll("_", " ")}`;
}

export default function HistoryTable({ items, onDelete }) {
  const [openId, setOpenId] = useState(null);

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Plant</th>
            <th>Condition</th>
            <th>Status</th>
            <th>Score</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map((r) => (
            <Fragment key={r.id}>
              <tr>
                <td>{new Date(r.created_at).toLocaleString()}</td>
                <td>{r.plant}</td>
                <td>{r.disease}</td>
                <td>
                  <span className={`badge ${r.health_status === "Healthy" ? "healthy" : "diseased"}`}>
                    {r.health_status}
                  </span>
                </td>
                <td>{(r.confidence * 100).toFixed(1)}%</td>
                <td className="row-actions">
                  <button
                    className="link-btn"
                    onClick={() => setOpenId(openId === r.id ? null : r.id)}
                  >
                    {openId === r.id ? "Hide" : "Details"}
                  </button>
                  <button className="link-btn danger" onClick={() => onDelete(r.id)}>
                    Delete
                  </button>
                </td>
              </tr>
              {openId === r.id && (
                <tr className="detail-row">
                  <td colSpan={6}>
                    {r.top_predictions.map((p) => (
                      <div className="bar-row" key={p.class}>
                        <div className="bar-label">
                          <span>{prettyClass(p.class)}</span>
                          <span>{(p.confidence * 100).toFixed(1)}%</span>
                        </div>
                        <div className="bar-track">
                          <div className="bar-fill" style={{ width: `${p.confidence * 100}%` }} />
                        </div>
                      </div>
                    ))}
                  </td>
                </tr>
              )}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}