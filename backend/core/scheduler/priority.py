from typing import List, Dict
from models.process import Process

def simulate_priority(processes: List[Process]) -> Dict:
    processes = sorted(processes, key=lambda p: (p.arrival_time, p.priority))  # ordenar por AT luego prioridad
    time = 0
    completed = []
    waiting_times = []

    ready_queue = []

    remaining = processes.copy()

    while remaining or ready_queue:
        # Añadir a la cola los procesos que han llegado hasta el tiempo actual
        ready_queue += [p for p in remaining if p.arrival_time <= time]
        remaining = [p for p in remaining if p.arrival_time > time]

        if not ready_queue:
            time += 1
            continue

        # Escoger el de mayor prioridad (menor número)
        ready_queue.sort(key=lambda p: p.priority)
        current = ready_queue.pop(0)

        start_time = time
        end_time = time + current.burst_time
        time = end_time

        completed.append({
            "pid": current.pid,
            "start": start_time,
            "end": end_time
        })

        waiting_times.append(start_time - current.arrival_time)

    avg_waiting_time = sum(waiting_times) / len(waiting_times) if waiting_times else 0
    return {
        "gantt": completed,
        "avg_waiting_time": round(avg_waiting_time, 2)
    }
