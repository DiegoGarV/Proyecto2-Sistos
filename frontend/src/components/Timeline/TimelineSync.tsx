import { useState, useEffect } from "react";
import GanttSync from "./GanttSync";
import styles from "./Timeline.module.css";

interface TimelineSyncProps {
  algorithm: "Mutex" | "Semaphore";
}

interface Block {
  label: string;
  start: number;
  duration: number;
  color: string;
  status: "ACCESSED" | "WAITING";
}

const TimelineSync: React.FC<TimelineSyncProps> = ({ algorithm }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [simulationData, setSimulationData] = useState<Block[]>([]);

  useEffect(() => {
    setIsPlaying(false);
    setSimulationData([]);
  }, [algorithm]);

  const getEndpoint = () => {
    const base = "http://localhost:8000/api/simulation-b/";
    return algorithm === "Mutex" ? `${base}run-mutex` : `${base}run-semaphore`;
  };

  const handlePlay = async () => {
    setIsPlaying(true);

    try {
        const response = await fetch(getEndpoint(), { method: "POST" });
        if (!response.ok) {
        const error = await response.json();
        alert(`Error: ${error.detail}`);
        setIsPlaying(false);
        return;
        }

        const data = await response.json();

        const timeline = data.timeline;
        const blocks: Block[] = [];

        Object.entries(timeline).forEach(([cycle, processes]: [string, any]) => {
            Object.entries(processes as Record<string, { status: "ACCESSED" | "WAITING"; action: string; resource: string }>).forEach(
                ([pid, info]) => {
                const { status, action, resource } = info;
                const colorCheck: string =
                    status === "ACCESSED" ? "rgb(55, 255, 0)" : "rgb(255, 123, 0)";

                blocks.push({
                    label: `${pid} - ${action} - ${resource}`,
                    start: parseInt(cycle),
                    duration: 1,
                    color: colorCheck,
                    status: status,
                });
                }
            );
        });



        console.log("Blocks: ", blocks);

        setSimulationData(blocks);
    } catch (err) {
        alert("Error al conectar con el servidor.");
        setIsPlaying(false);
    }
};


  return (
    <div className={styles.timelineContainer}>
      <div className={styles.controls}>
        <span
          onClick={handlePlay}
          className={`${styles.controlText} ${isPlaying ? styles.active : ""}`}
        >
          ▶️
        </span>
      </div>
      <GanttSync isPlaying={isPlaying} simulationData={simulationData} />
    </div>
  );
};

export default TimelineSync;
