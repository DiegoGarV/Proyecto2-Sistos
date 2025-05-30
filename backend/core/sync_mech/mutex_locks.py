from models.resource import Resource
from models.action import Action
from models.process import Process
from typing import List, Dict

class MutexSimulator:
    def __init__(self, processes: List[Process], resources: List[Resource], actions: List[Action]):
        self.processes = processes
        self.resources = {r.name: r for r in resources}
        self.actions = sorted(actions, key=lambda a: a.cycle)
        self.locked_resources: Dict[str, str] = {}  # recurso: proceso que lo tiene bloqueado

        # Estado por ciclo
        self.timeline: List[Dict] = []

    def simulate(self):
        current_cycle = 0
        action_index = 0

        while action_index < len(self.actions):
            cycle_actions = []
            # Tomar todas las acciones que ocurren en este ciclo
            while (action_index < len(self.actions)) and (self.actions[action_index].cycle == current_cycle):
                action = self.actions[action_index]
                cycle_actions.append(action)
                action_index += 1

            # Procesar acciones
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
        if action.action == "LOCK":
            if action.resource in self.locked_resources:
                return f"Recurso {action.resource} ya bloqueado por {self.locked_resources[action.resource]}"
            else:
                self.locked_resources[action.resource] = action.pid
                return f"{action.pid} bloquea {action.resource}"
        elif action.action == "UNLOCK":
            if self.locked_resources.get(action.resource) == action.pid:
                del self.locked_resources[action.resource]
                return f"{action.pid} libera {action.resource}"
            else:
                return f"{action.pid} intenta liberar {action.resource}, pero no lo posee"
        else:
            return f"Acción {action.action} no válida"

    def get_timeline(self):
        return self.timeline
