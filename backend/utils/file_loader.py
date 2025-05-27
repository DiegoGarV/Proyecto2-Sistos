from models.process import Process
from typing import List
import re

def load_processes_from_file(file_path: str) -> List[Process]:
    processes = []
    with open(file_path, 'r') as f:
        for i, line in enumerate(f.readlines(), start=1):
            line = line.strip()
            if not line or line.startswith("#"):
                continue  # Permitir líneas vacías o comentarios

            parts = [p.strip() for p in line.split(',')]
            if len(parts) != 4:
                raise ValueError(f"Línea {i} inválida: se esperaban 4 campos (PID, BT, AT, Priority).")

            pid, bt, at, prio = parts

            if not re.match(r'^[a-zA-Z0-9_]+$', pid):
                raise ValueError(f"Línea {i}: PID inválido '{pid}'")

            try:
                bt = int(bt)
                at = int(at)
                prio = int(prio)
            except ValueError:
                raise ValueError(f"Línea {i}: BT, AT y Priority deben ser enteros.")

            if bt < 0 or at < 0 or prio < 0:
                raise ValueError(f"Línea {i}: BT, AT y Priority deben ser no negativos.")

            processes.append(Process(pid, bt, at, prio))

    if not processes:
        raise ValueError("No se encontraron procesos válidos en el archivo.")

    return processes