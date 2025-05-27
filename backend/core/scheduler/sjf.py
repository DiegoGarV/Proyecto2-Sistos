from models.process import Process
from typing import List, Dict

def simulate_sjf(processes: List[Process]) -> Dict:
    processes = sorted(processes, key=lambda p: p.arrival_time)
    remaining = processes[:]
    gantt = []
    time = 0
    waiting_times = []

    while remaining:
        # Filtrar los procesos que ya llegaron
        ready = [p for p in remaining if p.arrival_time <= time]
        if not ready:
            time += 1  # Esperamos hasta que llegue alguien
            continue

        # Escoger el de menor burst time (si hay empate tomar el que llegó antes)
        ready.sort(key=lambda p: (p.burst_time, p.arrival_time))
        current = ready[0]

        start_time = time
        end_time = time + current.burst_time
        gantt.append({
            "pid": current.pid,
            "start": start_time,
            "end": end_time
        })

        waiting_time = start_time - current.arrival_time
        waiting_times.append(waiting_time)

        time = end_time
        remaining.remove(current)

    avg_waiting_time = round(sum(waiting_times) / len(waiting_times), 2)
    return {
        "gantt": gantt,
        "avg_waiting_time": avg_waiting_time
    }
