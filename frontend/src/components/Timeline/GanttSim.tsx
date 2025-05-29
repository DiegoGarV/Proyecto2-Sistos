import { useEffect, useRef, useState } from "react";
import styles from "./GanttSim.module.css";

interface GanttSimProps {
  algorithm: string;
  isPlaying: boolean;
  simulationData: Block[];
}

interface Block {
  label: string;
  start: number;
  duration: number;
  color: string;
}

const GanttSim: React.FC<GanttSimProps> = ({ isPlaying, simulationData }) => {
  const [cycle, setCycle] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const maxCycle = Math.max(...simulationData.map(b => b.start + b.duration), 0);
  const labels = Array.from(new Set(simulationData.map(b => b.label)));

  // Actualizar el ciclo si está reproduciendo
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
      }, 10);
    }

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPlaying, maxCycle]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollLeft = cycle * 40;
    }
  }, [cycle]);

  return (
    <div className={styles.ganttWrapper}>
      <div className={styles.timelineContainer} ref={containerRef}>
        <div className={styles.grid}>
          {/* Encabezado de ciclos */}
          <div className={styles.row}>
            {Array.from({ length: maxCycle }).map((_, i) => (
              <div key={`head-${i}`} className={styles.headerCell}>
                {i}
              </div>
            ))}
          </div>

          {/* Fila por proceso */}
          {labels.map((label) => (
            <div key={label} className={styles.row}>
              {Array.from({ length: maxCycle }).map((_, i) => {
                const block = simulationData.find(
                  b => b.label === label && b.start <= i && i < b.start + b.duration
                );

                const showBlock = block && i < cycle;

                return (
                  <div
                    key={`${label}-${i}`}
                    className={styles.cell}
                    style={{
                      backgroundColor: showBlock ? block!.color : "transparent",
                      color: showBlock ? "white" : "black",
                    }}
                  >
                    {showBlock && i === block!.start ? label : ""}
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

export default GanttSim;
