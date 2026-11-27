const CLASSES = [
  ["Pepper (bell) – Bacterial spot", 0.981, 0.994, 0.987, 156],
  ["Pepper (bell) – Healthy", 0.991, 0.986, 0.988, 217],
  ["Potato – Early blight", 0.987, 1.0, 0.993, 150],
  ["Potato – Late blight", 0.927, 0.966, 0.946, 145],
  ["Potato – Healthy", 0.793, 1.0, 0.885, 23],
  ["Tomato – Early blight", 0.946, 0.994, 0.969, 158],
  ["Tomato – Late blight", 1.0, 0.886, 0.939, 271],
  ["Tomato – Healthy", 0.967, 1.0, 0.983, 232],
];

const pct = (v) => `${(v * 100).toFixed(1)}%`;

export default function About() {
  return (
    <div className="about">
      <h1>About</h1>
      <p className="subtitle">What this tool does, how it was evaluated, and where it falls short.</p>

      <div className="card">
        <h2>The project</h2>
        <p>
          This is a university project that classifies a photo of a bell pepper, potato or tomato
          leaf into one of 8 classes (healthy or a specific disease). A convolutional neural network
          makes the prediction, a FastAPI backend serves it, and results are saved so they can be
          reviewed on the History, Dashboard and Statistics pages.
        </p>
      </div>

      <div className="card">
        <h2>Test results</h2>
        <p>
          Evaluated on a held-out test set of 1,352 images from the PlantVillage dataset:
          <strong> 96.97% accuracy</strong>, macro F1 96.1%.
        </p>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Class</th>
                <th>Precision</th>
                <th>Recall</th>
                <th>F1</th>
                <th>Test images</th>
              </tr>
            </thead>
            <tbody>
              {CLASSES.map(([name, p, r, f, n]) => (
                <tr key={name}>
                  <td>{name}</td>
                  <td>{pct(p)}</td>
                  <td>{pct(r)}</td>
                  <td>{pct(f)}</td>
                  <td>{n}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <h2>Limitations</h2>
        <ul>
          <li>
            <strong>Lab-style images only.</strong> The model was trained and tested on PlantVillage
            images, which are single leaves on plain backgrounds. It has not been tested on phone
            photos taken in a field, and accuracy there is likely to be lower.
          </li>
          <li>
            <strong>Only 8 classes.</strong> Other plants and other diseases are not recognised. The
            model will still return one of the 8 classes for an unrelated image.
          </li>
          <li>
            <strong>Uneven performance.</strong> Tomato late blight has the lowest recall (88.6%), so
            some cases are missed. Healthy potato has the lowest precision (79.3%) and only 23 test
            images, so its figures are unreliable.
          </li>
          <li>
            <strong>The score is not a probability of being right.</strong> It is the model's output
            confidence and is often very high even when the prediction is wrong.
          </li>
          <li>
            <strong>Possible overestimate.</strong> PlantVillage contains several images of the same
            leaf. If the train/test split did not separate them, the test accuracy may be too
            optimistic.
          </li>
          <li>
            <strong>Not a diagnosis.</strong> Results are for learning and demonstration. Confirm any
            disease with an agricultural expert before acting on it.
          </li>
        </ul>
      </div>
    </div>
  );
}