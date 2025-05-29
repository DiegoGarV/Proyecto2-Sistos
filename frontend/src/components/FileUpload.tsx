import { useState, useRef } from "react";
import styles from "./FileUpload.module.css";
import uploadIcon from "../assets/upload.png";

interface FileUploadProps {
  onFileUpload: (file: File, result: { success: boolean; message: string; content?: string }) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  const [loading, setLoading] = useState(false);
  const [_message, setMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null); // nueva referencia

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".txt")) {
      onFileUpload(file, { success: false, message: "Por favor, selecciona un archivo .txt" });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("http://127.0.0.1:8000/api/simulation-a/upload-processes", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        const content = await file.text(); // leer contenido del archivo local
        onFileUpload(file, { success: true, message: data.message || "Archivo cargado correctamente.", content });
      } else {
        onFileUpload(file, { success: false, message: data.error || "Error al cargar archivo." });
      }
    } catch (error) {
      onFileUpload(file, { success: false, message: "Error de conexión con el servidor." });
    } finally {
      setLoading(false);
    }
  };


  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // activar input manualmente
    }
  };

  return (
    <div className={styles.wrapper}>
      <button
        type="button"
        className={styles.uploadBtn}
        disabled={loading}
        onClick={triggerFileInput}
      >
        {loading ? "Cargando..." : "Subir archivo"}
        <img src={uploadIcon} alt="Subir" className={styles.icon} />
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept=".txt"
        style={{ display: "none" }}
        onChange={handleFileChange}
        disabled={loading}
      />
    </div>
  );
};

export default FileUpload;
