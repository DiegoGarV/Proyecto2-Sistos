import { useEffect, useRef, useState } from "react";
import styles from "./GanttSim.module.css";

interface GanttSimProps {
  algorithm: string;
  isPlaying: boolean;
}

interface Block {
  id: number;
  label: string;
  duration: number; // en segundos para la demo
  color: string;
}

const mockBlocks: Block[] = [
  { id: 1, label: "P1", duration: 3, color: "#007bff" },
  { id: 2, label: "P2", duration: 2, color: "#28a745" },
  { id: 3, label: "P3", duration: 1, color: "#ffc107" },
];

const GanttSim: React.FC<GanttSimProps> = ({ algorithm, isPlaying }) => {
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isPlaying && intervalRef.current === null) {
      intervalRef.current = setInterval(() => {
        setProgress((prev) => prev + 1);
      }, 1000);
    } else if (!isPlaying && intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPlaying]);

  return (
    <div className={styles.ganttWrapper}>
      <h3>{algorithm}</h3>
      <div className={styles.timeline}>
        {mockBlocks.map((block, _index) => (
          <div
            key={block.id}
            className={styles.block}
            style={{
              width: `${block.duration * 80}px`,
              backgroundColor: block.color,
            }}
          >
            {block.label}
          </div>
        ))}
        <div
          className={styles.indicator}
          style={{ left: `${progress * 80}px` }}
        />
      </div>
    </div>
  );
};

export default GanttSim;