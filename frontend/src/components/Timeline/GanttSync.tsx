import { useEffect, useRef, useState } from "react";
import styles from "./GanttSim.module.css";

interface GanttSyncProps {
  isPlaying: boolean;
  simulationData: Block[];
}

interface Block {
  label: string;
  start: number;
  duration: number;
  color: string;
  status: "ACCESSED" | "WAITING";
}

const GanttSync: React.FC<GanttSyncProps> = ({ isPlaying, simulationData }) => {
  const [cycle, setCycle] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Determinar el número máximo de ciclos
    const maxCycle = Math.max(...simulationData.map(b => b.start + b.duration), 0);

    const processLabels = Array.from(
        new Set(simulationData.map(b => b.label.split(" - ")[0]))
    );


  // Avanzar ciclos si se está reproduciendo
  useEffect(() => {
    if (isPlaying && intervalRef.current === null) {
      intervalRef.current = setInterval(() => {
        setCycle(prev => {
          if (prev + 1 >= maxCycle) {
            clearInterval(intervalRef.current!);
            intervalRef.current = null;
            return maxCycle;
          }
          return prev + 1;
        });
      }, 500); // ajusta la velocidad a tu preferencia
    }

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPlaying, maxCycle]);

  // Scroll automático al avanzar el ciclo
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollLeft = cycle * 40; // ajusta el tamaño de la celda si deseas
    }
  }, [cycle]);

  return (
    <div className={styles.ganttWrapper}>
      <div className={styles.cycleIndicator}>Ciclo actual: {cycle}</div>
      <div className={styles.timelineContainer} ref={containerRef}>
        <div className={styles.grid}>
          {/* Encabezado de ciclos */}
          <div className={styles.row}>
            {Array.from({ length: maxCycle }).map((_, i) => (
              <div key={`head-${i}`} className={styles.headerCell2}>
                {i}
              </div>
            ))}
          </div>

          {/* Fila por proceso */}
        {processLabels.map(processLabel => (
            <div key={processLabel} className={styles.row}>
                {Array.from({ length: maxCycle }).map((_, i) => {
                // Buscar un bloque que corresponda a este proceso en este ciclo
                const block = simulationData.find(
                    b => b.label.startsWith(processLabel) && b.start === i
                );

                const showBlock = block && i < cycle;

                return (
                    <div
                    key={`${processLabel}-${i}`}
                    className={styles.cell2}
                    style={{
                        backgroundColor: showBlock ? block.color : "transparent",
                        color: showBlock ? "white" : "black",
                    }}
                    >
                    {showBlock ? block.label : ""}
                    </div>
                );
                })}
            </div>
        ))}
        </div>
      </div>
    </div>
  );
};

export default GanttSync;
