from threading import Thread, Event
from typing import Dict
import time

class SimulationManager:
    def __init__(self):
        self._threads: Dict[str, Thread] = {}
        self._pause_events: Dict[str, Event] = {}

    def start_simulation(self, key: str, func, *args):
        if key in self._threads:
            return  # Ya corriendo

        pause_event = Event()
        self._pause_events[key] = pause_event

        def runner():
            for step in func(*args):
                if pause_event.is_set():
                    while pause_event.is_set():
                        time.sleep(0.1)  # Espera mientras esté pausado
                print(f"Simulando paso: {step}")
                time.sleep(1)  # Simulación lenta para demo

        thread = Thread(target=runner, daemon=True)
        self._threads[key] = thread
        thread.start()

    def pause_simulation(self, key: str):
        if key in self._pause_events:
            self._pause_events[key].set()

    def resume_simulation(self, key: str):
        if key in self._pause_events:
            self._pause_events[key].clear()
