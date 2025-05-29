import { useState, useEffect } from "react";
import GanttSim from "./GanttSim";
import styles from "./Timeline.module.css";

interface TimelineProps {
    algorithm: string;
    quantum?: number; // Solo para el Round Robin
    onSimulationEnd?: (algorithm: string, avg: number) => void;
}

interface Block {
    label: string;
    start: number;
    duration: number;
    color: string;
}

const Timeline: React.FC<TimelineProps> = ({ algorithm, quantum, onSimulationEnd }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [simulationData, setSimulationData] = useState<Block[]>([]);

    useEffect(() => {
        // Reiniciar al cambiar de algoritmo
        setIsPlaying(false);
    }, [algorithm]);


    const getEndpoint = () => {
        const base = "http://localhost:8000/api/simulation-a/";
        switch (algorithm) {
        case "First In First Out":
            return `${base}fifo`;
        case "Shortest Job First":
            return `${base}sjf`;
        case "Shortest Remaining Time":
            return `${base}srt`;
        case "Round Robin":
            return `${base}round_robin?quantum=${quantum ?? 5}`;
        case "Priority":
            return `${base}priority`;
        default:
            return "";
        }
    };

    const handlePlay = async () => {
        setIsPlaying(true);

        try {
            const response = await fetch(getEndpoint());
            if (!response.ok) {
                const error = await response.json();
                alert(`Error: ${error.detail}`);
                return;
            }

            const data = await response.json();
            const colorPalette = ["#007bff", "#28a745", "#ffc107", "#dc3545", "#6f42c1", "#17a2b8", "#fd7e14", "#20c997"];
            const pidColorMap: Record<string, string> = {};
            let colorIndex = 0;

            data.gantt.forEach((block: any) => {
                if (!pidColorMap[block.pid]) {
                    pidColorMap[block.pid] = colorPalette[colorIndex % colorPalette.length];
                    colorIndex++;
                }
            });

            const transformed = data.gantt.map((block: any) => ({
                label: block.pid,
                start: block.start,
                duration: block.end - block.start,
                color: pidColorMap[block.pid],
            }));
            setSimulationData(transformed);

            if (data.avg_waiting_time !== undefined && onSimulationEnd) {
                console.log("Llamando a onSimulationEnd con:", algorithm, data.average_waiting_time);
                onSimulationEnd(algorithm, data.avg_waiting_time);
            }


        } catch (err) {
            alert("Error al conectar con el servidor.");
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
        <GanttSim algorithm={algorithm} isPlaying={isPlaying} simulationData={simulationData} />
        </div>
    );
};

export default Timeline;
