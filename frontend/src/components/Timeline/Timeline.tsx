import { useState } from "react";
import GanttSim from "./GanttSim";
import styles from "./Timeline.module.css";

interface TimelineProps {
  algorithm: string;
}

const Timeline: React.FC<TimelineProps> = ({ algorithm }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  return (
    <div className={styles.timelineContainer}>
      <div className={styles.controls}>
        <button onClick={handlePlay}>▶️</button>
        <button onClick={handlePause}>⏸️</button>
      </div>
      <GanttSim algorithm={algorithm} isPlaying={isPlaying} />
    </div>
  );
};

export default Timeline;
