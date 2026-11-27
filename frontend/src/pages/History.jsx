import { useCallback, useEffect, useState } from "react";
import { api } from "../services/api";
import HistoryTable from "../components/HistoryTable";

const PAGE = 50;

export default function History() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async (offset = 0) => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/history", { params: { limit: PAGE, offset } });
      setItems((prev) => (offset === 0 ? data.items : [...prev, ...data.items]));
      setTotal(data.total);
    } catch {
      setError("Could not load history. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(0);
  }, [load]);

  async function remove(id) {
    if (!window.confirm("Delete this record?")) return;
    try {
      await api.delete(`/history/${id}`);
      setItems((prev) => prev.filter((r) => r.id !== id));
      setTotal((t) => t - 1);
    } catch {
      setError("Could not delete the record.");
    }
  }

  async function clearAll() {
    if (!window.confirm("Delete ALL history records? This cannot be undone.")) return;
    try {
      await api.delete("/history");
      setItems([]);
      setTotal(0);
    } catch {
      setError("Could not clear the history.");
    }
  }

  return (
    <>
      <h1>History</h1>
      <p className="subtitle">Your previous predictions, newest first.</p>

      <div className="card">
        <div className="toolbar">
          <span className="note">
            {total === 0 ? "No records" : `Showing ${items.length} of ${total}`}
          </span>
          <button className="btn danger" disabled={total === 0 || loading} onClick={clearAll}>
            Clear all
          </button>
        </div>

        {error && <div className="error">{error}</div>}
        {loading && items.length === 0 && <div className="empty">Loading…</div>}
        {!loading && !error && items.length === 0 && (
          <div className="empty">No predictions yet. Analyze a leaf on the Detect page.</div>
        )}

        {items.length > 0 && <HistoryTable items={items} onDelete={remove} />}

        {items.length < total && (
          <div className="actions">
            <button className="btn secondary" disabled={loading} onClick={() => load(items.length)}>
              {loading ? "Loading…" : "Load more"}
            </button>
          </div>
        )}
      </div>
    </>
  );
}