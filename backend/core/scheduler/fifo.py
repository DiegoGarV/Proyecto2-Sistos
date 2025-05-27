from models.process import Process
from typing import List, Dict


def simulate_fifo(processes: List[Process]) -> Dict:
    # Ordenar por Arrival Time
    queue = sorted(processes, key=lambda p: p.arrival_time)

    current_time = 0
    gantt_chart = []
    total_waiting_time = 0

    for process in queue:
        # Si el proceso llega después del tiempo actual, el CPU espera (idle)
        if process.arrival_time > current_time:
            gantt_chart.append({
                "pid": "IDLE",
                "start": current_time,
                "end": process.arrival_time
            })
            current_time = process.arrival_time

        start_time = current_time
        end_time = start_time + process.burst_time

        waiting_time = start_time - process.arrival_time
        total_waiting_time += waiting_time

        gantt_chart.append({
            "pid": process.pid,
            "start": start_time,
            "end": end_time
        })

        current_time = end_time

    avg_waiting_time = total_waiting_time / len(queue)

    return {
        "gantt": gantt_chart,
        "avg_waiting_time": avg_waiting_time
    }
