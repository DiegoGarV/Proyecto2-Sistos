from models.resource import Resource
from models.action import Action
from models.process import Process
from typing import List, Dict

class SemaphoreSimulator:
    def __init__(self, processes: List[Process], resources: List[Resource], actions: List[Action]):
        self.processes = processes
        self.resources = {r.name: r.counter for r in resources}
        self.actions = sorted(actions, key=lambda a: a.cycle)
        self.timeline: List[Dict] = []

    def simulate(self):
        current_cycle = 0
        action_index = 0

        while action_index < len(self.actions):
            cycle_actions = []
            while (action_index < len(self.actions)) and (self.actions[action_index].cycle == current_cycle):
                action = self.actions[action_index]
                cycle_actions.append(action)
                action_index += 1

            for action in cycle_actions:
                result = self._process_action(action)
                self.timeline.append({
                    "cycle": current_cycle,
                    "process": action.pid,
                    "action": action.action,
                    "resource": action.resource,
                    "status": result
                })

            current_cycle += 1

    def _process_action(self, action: Action):
        if action.action == "WAIT":
            if self.resources.get(action.resource, 0) > 0:
                self.resources[action.resource] -= 1
                return f"{action.pid} decremente {action.resource} a {self.resources[action.resource]}"
            else:
                return f"{action.pid} espera: {action.resource} no disponible"
        elif action.action == "SIGNAL":
            self.resources[action.resource] = self.resources.get(action.resource, 0) + 1
            return f"{action.pid} incrementa {action.resource} a {self.resources[action.resource]}"
        else:
            return f"Acción {action.action} no válida"

    def get_timeline(self):
        return self.timeline
