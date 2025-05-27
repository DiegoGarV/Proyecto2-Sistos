from typing import Optional

class Process:
    def __init__(self, pid: str, bt: int, at: int, priority: int):
        self.pid = pid
        self.burst_time = bt
        self.arrival_time = at
        self.priority = priority

        # Para métricas
        self.start_time: Optional[int] = None
        self.completion_time: Optional[int] = None
        self.waiting_time: Optional[int] = None
        self.turnaround_time: Optional[int] = None

    def __repr__(self):
        return f"<Process {self.pid}: BT={self.burst_time}, AT={self.arrival_time}, Priority={self.priority}>"