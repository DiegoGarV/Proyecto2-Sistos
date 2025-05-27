from models.process import Process
from typing import List

def simulate_srt(processes: List[Process]):
    # Crear una copia para no modificar los procesos originales
    remaining = [
        {
            "pid": p.pid,
            "arrival_time": p.arrival_time,
            "remaining_time": p.burst_time,
            "priority": p.priority,
            "start_time": None,
            "end_time": None,
            "completed": False
        } for p in processes
    ]

    time = 0
    completed = 0
    gantt_chart = []
    last_pid = None
    waiting_times = {}
    start_times = {}

    while completed < len(remaining):
        # Filtrar procesos disponibles
        available = [p for p in remaining if p["arrival_time"] <= time and not p["completed"]]

        if available:
            # Elegir el de menor tiempo restante
            current = min(available, key=lambda x: x["remaining_time"])

            if current["pid"] != last_pid:
                # Cambio de proceso (nuevo bloque en Gantt)
                gantt_chart.append({
                    "pid": current["pid"],
                    "start": time
                })
                last_pid = current["pid"]
                if current["pid"] not in start_times:
                    start_times[current["pid"]] = time

            # Ejecutar por 1 ciclo
            current["remaining_time"] -= 1

            # Si termina
            if current["remaining_time"] == 0:
                current["completed"] = True
                current["end_time"] = time + 1
                completed += 1
                # Actualizar fin del bloque actual
                gantt_chart[-1]["end"] = time + 1
                waiting_times[current["pid"]] = (current["end_time"] - current["arrival_time"] -
                                                 (current["end_time"] - start_times[current["pid"]]))
            else:
                gantt_chart[-1]["end"] = time + 1 

        else:
            # Si no hay procesos disponibles, el CPU está idle
            last_pid = None

        time += 1

    # Calcular avg waiting time
    avg_waiting_time = round(sum(waiting_times.values()) / len(waiting_times), 2)

    return {
        "gantt": gantt_chart,
        "avg_waiting_time": avg_waiting_time
    }
