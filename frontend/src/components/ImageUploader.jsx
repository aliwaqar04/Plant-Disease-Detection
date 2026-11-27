import { useRef, useState } from "react";

const MAX_MB = 5; // same limit as MAX_UPLOAD_MB in the backend .env
const TYPES = ["image/jpeg", "image/png"];

export default function ImageUploader({ preview, onSelect, onError, disabled }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  function handleFile(file) {
    if (!file) return;
    if (!TYPES.includes(file.type)) {
      onError("Only JPEG and PNG images are supported.");
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      onError(`File is too large. Maximum size is ${MAX_MB} MB.`);
      return;
    }
    onSelect(file);
  }

  return (
    <div
      className={`dropzone${dragging ? " dragging" : ""}${disabled ? " disabled" : ""}`}
      role="button"
      tabIndex={0}
      onClick={() => inputRef.current.click()}
      onKeyDown={(e) => e.key === "Enter" && inputRef.current.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        handleFile(e.dataTransfer.files[0]);
      }}
    >
      {preview && <img className="preview" src={preview} alt="Selected leaf preview" />}
      <div>
        {preview
          ? "Click or drop another image to replace it"
          : "Drag and drop a leaf image here, or click to browse (JPEG or PNG, up to 5 MB)"}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png"
        hidden
        onChange={(e) => {
          handleFile(e.target.files[0]);
          e.target.value = ""; // lets you pick the same file again
        }}
      />
    </div>
  );
}