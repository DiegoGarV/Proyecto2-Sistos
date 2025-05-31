import { useState, useEffect } from "react";
import styles from "./SimulationB.module.css";
import cleanIcon from "../assets/clean-brush.png";
import reloadIcon from "../assets/refresh-arrow.png";
import TimelineSync from "../components/Timeline/TimelineSync";

const SimulationB = () => {
  const [processesFileInfo, setProcessesFileInfo] = useState<string>("");
  const [resourcesFileInfo, setResourcesFileInfo] = useState<string>("");
  const [actionsFileInfo, setActionsFileInfo] = useState<string>("");
  const [selectedSim, setSelectedSim] = useState<string>("mutex");

  useEffect(() => {
    const storedProcesses = localStorage.getItem("processesFileInfo");
    const storedResources = localStorage.getItem("resourcesFileInfo");
    const storedActions = localStorage.getItem("actionsFileInfo");

    if (storedProcesses) setProcessesFileInfo(storedProcesses);
    if (storedResources) setResourcesFileInfo(storedResources);
    if (storedActions) setActionsFileInfo(storedActions);
  }, []);

  const handleFileUpload = async (type: "processes" | "resources" | "actions") => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".txt";

    fileInput.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch(`http://localhost:8000/api/simulation-b/upload-${type}`, {
          method: "POST",
          body: formData,
        });
        const data = await res.json();

        if (data.message) {
          let formattedContent = "";

          if (type === "processes") {
            const processes = data.processes;
            formattedContent = processes
              .map((p: any) => `${p.pid}, ${p.burst_time}, ${p.arrival_time}, ${p.priority}`)
              .join("\n");
            setProcessesFileInfo(formattedContent);

          } else if (type === "resources") {
            const resources = data.resources;
            formattedContent = resources
              .map((r: any) => `${r.name}, ${r.counter}`)
              .join("\n");
            setResourcesFileInfo(formattedContent);

          } else if (type === "actions") {
            const actions = data.actions;
            formattedContent = actions
              .map((a: any) => `${a.pid}, ${a.action}, ${a.resource}, ${a.cycle}`)
              .join("\n");
            setActionsFileInfo(formattedContent);
          }

          // Guarda también en localStorage para mantenerlos tras recargar
          localStorage.setItem(`${type}FileInfo`, formattedContent);
        } else {
          console.error("Error al cargar archivo:", data.error);
          if (type === "processes") setProcessesFileInfo("Error al cargar procesos.");
          else if (type === "resources") setResourcesFileInfo("Error al cargar recursos.");
          else if (type === "actions") setActionsFileInfo("Error al cargar acciones.");
        }
      } catch (err) {
        console.error("Error al cargar archivo:", err);
      }
    };

    fileInput.click();
  };

  const handleCleanAll = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/simulation-b/clear-all", {
        method: "POST",
      });
      const data = await res.json();

      if (data.message) {
        setProcessesFileInfo("Datos eliminados.");
        setResourcesFileInfo("Datos eliminados.");
        setActionsFileInfo("Datos eliminados.");

        localStorage.removeItem("processesFileInfo");
        localStorage.removeItem("resourcesFileInfo");
        localStorage.removeItem("actionsFileInfo");
      }
    } catch (error) {
      console.error("Error al limpiar datos:", error);
    }
  };

  const handleCleanSingle = async (type: "processes" | "resources" | "actions") => {
    try {
      const res = await fetch(`http://localhost:8000/api/simulation-b/clear-${type}`, {
        method: "POST",
      });
      const data = await res.json();

      if (data.message) {
        if (type === "processes") {
          setProcessesFileInfo("Datos eliminados.");
          localStorage.removeItem("processesFileInfo");
        } else if (type === "resources") {
          setResourcesFileInfo("Datos eliminados.");
          localStorage.removeItem("resourcesFileInfo");
        } else if (type === "actions") {
          setActionsFileInfo("Datos eliminados.");
          localStorage.removeItem("actionsFileInfo");
        }
      }
    } catch (error) {
      console.error(`Error al borrar ${type}:`, error);
    }
  };

  const handleResetSimulation = () => {
      
  };

  useEffect(() => {
    handleResetSimulation();
  }, [selectedSim]);

  return (
    <div className={styles.container}>
      <h1>Simulación de Mecanismos de Sincronización</h1>

      <div className={styles.buttonRow}>
        <button onClick={handleCleanAll} className={styles.cleanBtn}>
          Limpiar todos los datos
          <img src={cleanIcon} alt="Limpiar" className={styles.icon} />
        </button>
      </div>

      <div className={styles.uploadSection}>
        <div className={styles.uploadBox}>
          <div className={styles.uploadHeader}>
            <button
              className={styles.uploadBtn}
              onClick={() => handleFileUpload("processes")}
            >
              Cargar Procesos
            </button>
            <button
              className={styles.deleteBtn}
              onClick={() => handleCleanSingle("processes")}
            >
              <img src={cleanIcon} alt="Borrar" className={styles.icon} />
            </button>
          </div>
          <div className={styles.fileContentBox}>
            <strong style={{ color: "black" }}>Procesos:</strong>
            <pre>{processesFileInfo || "No hay procesos cargados."}</pre>
          </div>
        </div>

        <div className={styles.uploadBox}>
          <div className={styles.uploadHeader}>
            <button
              className={styles.uploadBtn}
              onClick={() => handleFileUpload("resources")}
            >
              Cargar Recursos
            </button>
            <button
              className={styles.deleteBtn}
              onClick={() => handleCleanSingle("resources")}
            >
              <img src={cleanIcon} alt="Borrar" className={styles.icon} />
            </button>
          </div>
          <div className={styles.fileContentBox}>
            <strong style={{ color: "black" }}>Recursos:</strong>
            <pre>{resourcesFileInfo || "No hay recursos cargados."}</pre>
          </div>
        </div>

        <div className={styles.uploadBox}>
          <div className={styles.uploadHeader}>
            <button
              className={styles.uploadBtn}
              onClick={() => handleFileUpload("actions")}
            >
              Cargar Acciones
            </button>
            <button
              className={styles.deleteBtn}
              onClick={() => handleCleanSingle("actions")}
            >
              <img src={cleanIcon} alt="Borrar" className={styles.icon} />
            </button>
          </div>
          <div className={styles.fileContentBox}>
            <strong style={{ color: "black" }}>Acciones:</strong>
            <pre>{actionsFileInfo || "No hay acciones cargadas."}</pre>
          </div>
        </div>
      </div>

      <div className={styles.resetSection}>
        <button className={styles.resetBtn} onClick={handleResetSimulation}>
          Reiniciar Simulación
          <img src={reloadIcon} alt="Reiniciar" className={styles.reloadIcon} />
        </button>
        <select
          className={styles.selectBox}
          value={selectedSim}
          onChange={(e) => setSelectedSim(e.target.value)}
        >
          <option value="mutex">Mutex</option>
          <option value="semaphore">Semáforos</option>
        </select>
      </div>

      <TimelineSync algorithm={selectedSim === "mutex" ? "Mutex" : "Semaphore"} />
    </div>
  );
};

export default SimulationB;
