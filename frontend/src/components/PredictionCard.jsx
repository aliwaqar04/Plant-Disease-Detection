function prettyClass(name) {
  const [plant, disease] = name.split("___");
  return `${plant.replaceAll("_", " ")} – ${disease.replaceAll("_", " ")}`;
}

function List({ title, items }) {
  if (!items || items.length === 0) return null;
  return (
    <>
      <h3>{title}</h3>
      <ul>{items.map((t) => <li key={t}>{t}</li>)}</ul>
    </>
  );
}

export default function PredictionCard({ result, info }) {
  const diseased = result.health_status === "Diseased";
  return (
    <>
      <div className="card">
        <div className="result-head">
          <div>
            <h2>{result.plant} – {result.disease}</h2>
            <span className={`badge ${diseased ? "diseased" : "healthy"}`}>
              {result.health_status}
            </span>
          </div>
          <div className="score">
            <strong>{(result.confidence * 100).toFixed(1)}%</strong>
            <div className="note">model score, not a calibrated probability</div>
          </div>
        </div>

        <h3 style={{ marginBottom: 0 }}>Top predictions</h3>
        {result.top_predictions.map((p) => (
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
      </div>

      {info && (
        <div className="card info">
          <h2>About this condition</h2>
          <p>{info.description}</p>
          <List title="Symptoms" items={info.symptoms} />
          <List title="Management" items={info.management} />
          <List title="Prevention" items={info.prevention} />
          <div className="disclaimer">{info.disclaimer}</div>
        </div>
      )}
    </>
  );
}