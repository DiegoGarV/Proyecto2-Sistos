from models.process import Process
from typing import List, Dict

def simulate_round_robin(processes: List[Process], quantum: int) -> Dict:
    processes = sorted(processes, key=lambda p: p.arrival_time)
    ready_queue = []
    gantt = []
    time = 0
    index = 0
    remaining_bt = {p.pid: p.burst_time for p in processes}
    waiting_time = {p.pid: 0 for p in processes}
    last_exec_time = {p.pid: p.arrival_time for p in processes}
    finished = set()

    while len(finished) < len(processes):
        # Agregar procesos que han llegado al tiempo actual
        while index < len(processes) and processes[index].arrival_time <= time:
            ready_queue.append(processes[index])
            index += 1

        if not ready_queue:
            time += 1
            continue

        current = ready_queue.pop(0)
        start_time = time
        exec_time = min(quantum, remaining_bt[current.pid])
        time += exec_time
        remaining_bt[current.pid] -= exec_time
        gantt.append({"pid": current.pid, "start": start_time, "end": time})

        # Calcular tiempo de espera acumulado
        waiting_time[current.pid] += start_time - last_exec_time[current.pid]
        last_exec_time[current.pid] = time

        # Agregar procesos que llegaron durante la ejecución
        while index < len(processes) and processes[index].arrival_time <= time:
            ready_queue.append(processes[index])
            index += 1

        # Si el proceso no ha terminado, se vuelve a encolar
        if remaining_bt[current.pid] > 0:
            ready_queue.append(current)
        else:
            finished.add(current.pid)

    avg_waiting = round(sum(waiting_time.values()) / len(processes), 2)
    return {"gantt": gantt, "avg_waiting_time": avg_waiting}