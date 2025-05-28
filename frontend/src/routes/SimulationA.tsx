import { useState } from "react";
import styles from "./SimulationA.module.css";
import Timeline from "../components/Timeline/Timeline.tsx";
import FileUpload from "../components/FileUpload";

const SimulationA = () => {
  const [_fileUploaded, setFileUploaded] = useState(false);

  const handleReset = () => {
    // lógica para reiniciar simulación
    setFileUploaded(false);
    // Aquí podrías limpiar estados globales o llamar a un endpoint si es necesario
  };

  const handleFileUpload = (file: File) => {
    // lógica para procesar archivo (puedes pasar esto al store también)
    console.log("Archivo recibido:", file.name);
    setFileUploaded(true);
  };

  const algorithms = [
    "First In First Out",
    "Shortest Job First",
    "Shortest Remaining Time",
    "Round Robin",
    "Priority",
  ];

  return (
    <div className={styles.container}>
      <h1>Simulación de Calendarización</h1>

      <div className={styles.buttonRow}>
        <button onClick={handleReset} className={styles.resetBtn}>🔄 Reiniciar</button>
        <FileUpload onFileUpload={handleFileUpload} />
      </div>

      <div className={styles.timelines}>
        {algorithms.map((alg) => (
          <div key={alg} className={styles.timelineSection}>
            <h2>{alg}</h2>
            <Timeline algorithm={alg} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimulationA;
