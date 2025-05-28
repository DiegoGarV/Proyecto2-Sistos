import { useState } from "react";

interface FileUploadProps {
  onFileUpload: (file: File) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".txt")) {
      setMessage("Por favor, selecciona un archivo .txt");
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/simulation-a/upload-processes", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || "Archivo cargado correctamente.");
        onFileUpload(file);
      } else {
        setMessage(data.error || "Error al cargar archivo.");
      }
    } catch (error) {
      setMessage("Error de conexión con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <label htmlFor="file-upload" style={{ cursor: "pointer", color: "#0055ff", textDecoration: "underline" }}>
        {loading ? "Cargando..." : "Subir archivo .txt"}
      </label>
      <input
        id="file-upload"
        type="file"
        accept=".txt"
        style={{ display: "none" }}
        onChange={handleFileChange}
        disabled={loading}
      />
      {message && <p style={{ marginTop: 8, color: message.includes("error") ? "red" : "green" }}>{message}</p>}
    </div>
  );
};

export default FileUpload;
