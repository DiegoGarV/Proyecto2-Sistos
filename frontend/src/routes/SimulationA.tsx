import { useState, useEffect } from "react";
import styles from "./SimulationA.module.css";
import Timeline from "../components/Timeline/Timeline.tsx";
import FileUpload from "../components/FileUpload";
import reloadIcon from "../assets/refresh-arrow.png";
import cleanIcon from "../assets/clean-brush.png";

const SimulationA = () => {
  const [_fileUploaded, setFileUploaded] = useState(false);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string | null>(null);
  const [quantum, setQuantum] = useState(5);
  const [uploadResult, setUploadResult] = useState<{ success: boolean; message: string; content?: string } | null>(null);
  const [results, setResults] = useState<{ algorithm: string, average: number, quantum?: number }[]>([]);

  useEffect(() => {
    const fetchStoredProcesses = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/simulation-a/stored-processes");
        const data = await res.json();

        setUploadResult({
          success: data.success,
          content: data.processes.map((p: any) => `PID: ${p.pid}, Tiempo llegada: ${p.arrival_time}, Rafaga: ${p.burst_time}${p.priority !== undefined ? `, Prioridad: ${p.priority}` : ''}`).join('\n'),
          message: data.message
        });
      } catch (err) {
        console.error("Error al cargar procesos guardados:", err);
      }
    };

    fetchStoredProcesses();
  }, []);

  const handleSimulationEnd = (algorithm: string, average: number) => {
    const fullName = algorithm === "Round Robin" ? `${algorithm} ${quantum}` : algorithm;

    const alreadyExists = results.some(r => r.algorithm === fullName && r.average === average);
    if (alreadyExists) return;

    const result = algorithm === "Round Robin"
      ? { algorithm: fullName, average, quantum }
      : { algorithm: fullName, average };

    setResults(prev => [...prev, result]);
  };

  const handleReset = () => {
    setSelectedAlgorithm(null);
    setQuantum(5);
    setResults([]);
  };

  const handleClean = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/simulation-a/clean-processes", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setUploadResult({ success: true, message: "", content: "Procesos eliminados" });
      } else {
        setUploadResult({ success: false, message: "Error al limpiar procesos." });
      }
    } catch (error) {
      setUploadResult({ success: false, message: "Error de conexión con el backend." });
    }
  };


  const handleFileUpload = (file: File, result: { success: boolean; message: string; content?: string }) => {
    console.log("Archivo recibido:", file.name);
    setFileUploaded(result.success);
    setUploadResult(result);
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
        <div className={styles.leftButtons}>
          <button onClick={handleReset} className={styles.resetBtn}>
            Reiniciar
            <img src={reloadIcon} alt="Reiniciar" className={styles.icon} />
          </button>
          <button onClick={handleClean} className={styles.cleanBtn}>
            Limpiar datos
            <img src={cleanIcon} alt="Limpiar" className={styles.icon} />
          </button>
        </div>
        <FileUpload onFileUpload={handleFileUpload} />
      </div>

      <div className={styles.uploadStatusBox}>
        <strong style={{ color: "black" }}>Contenido del archivo:</strong>
        {uploadResult ? (
          uploadResult.success ? (
            <pre className={styles.fileContent}>
              {uploadResult.content || "No hay procesos"}
            </pre>
          ) : (
            <p className={styles.errorText}>{uploadResult.message}</p>
          )
        ) : (
          <p style={{ marginTop: "0.5rem", color:"black" }}>No hay procesos</p>
        )}
      </div>


      <div className={styles.algorithmSelector}>
        <label htmlFor="algorithm-select">Selecciona un algoritmo:</label>
        <select
          id="algorithm-select"
          value={selectedAlgorithm || ""}
          onChange={(e) => setSelectedAlgorithm(e.target.value)}
        >
          <option value="" disabled>-- Selecciona una opción --</option>
          {algorithms.map((alg) => (
            <option key={alg} value={alg}>{alg}</option>
          ))}
        </select>
      </div>

      <div className={styles.timelines}>
        {selectedAlgorithm && (
          <div className={styles.timelineSection}>
            <h2>{selectedAlgorithm}</h2>

            {selectedAlgorithm === "Round Robin" && (
              <div className={styles.quantumInput}>
                <label htmlFor="quantum">Quantum:</label>
                <input
                  type="number"
                  id="quantum"
                  min={0}
                  value={quantum}
                  onChange={(e) => setQuantum(Math.max(0, parseInt(e.target.value) || 0))}
                />
              </div>
            )}

            <Timeline
              key={selectedAlgorithm}
              algorithm={selectedAlgorithm}
              quantum={quantum}
              onSimulationEnd={handleSimulationEnd}
            />
          </div>
        )}
      </div>

      {results.length > 0 && (
        <div className={styles.resultsTable}>
          <h3>Resultados de Simulaciones</h3>
          <table>
            <thead>
              <tr>
                <th>Algoritmo</th>
                <th>Tiempo de Espera Promedio</th>
              </tr>
            </thead>
            <tbody>
              {results.map((res, index) => (
                <tr key={index}>
                  <td>{res.algorithm}</td>
                  <td>{res.average.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SimulationA;
