import { useNavigate } from "react-router-dom";
import calendarImg from "../assets/calendar.png";
import syncImg from "../assets/sync.png";

import styles from "./Home.module.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <h1>Simuladores</h1>
      <div className={styles.grid}>
        <div
          className={styles.card}
          onClick={() => navigate("/simulation-a")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && navigate("/simulation-a")}
        >
          <img src={calendarImg} alt="Simulación Calendarización" />
          <h2>Simulación Calendarización</h2>
          <p>Simula algoritmos de scheduling de procesos</p>
        </div>

        <div
          className={styles.card}
          onClick={() => navigate("/simulation-b")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && navigate("/simulation-b")}
        >
          <img src={syncImg} alt="Simulación Sincronización" />
          <h2>Simulación Sincronización</h2>
          <p>Simula mecanismos de sincronización</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
