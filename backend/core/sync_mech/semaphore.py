from models.resource import Resource
from models.action import Action
from models.process import Process
from typing import List, Dict

def simulate_semaphores(processes: List[Process], resources: List[Resource], actions: List[Action]):
    resource_counters: Dict[str, int] = {res.name: res.counter for res in resources}
    
    process_states: Dict[int, Dict[str, Dict[str, str]]] = {}
    
    actions.sort(key=lambda x: x.cycle)
    max_cycle = max(action.cycle for action in actions)

    for cycle in range(max_cycle + 1):
        process_states[cycle] = {}
        current_actions = [a for a in actions if a.cycle == cycle]
        
        resource_usage: Dict[str, int] = {res.name: 0 for res in resources}
        
        for action in current_actions:
            pid = action.pid
            resource_name = action.resource
            act_type = action.action

            if resource_usage[resource_name] < resource_counters[resource_name]:
                resource_usage[resource_name] += 1
                process_states[cycle][pid] = {
                    "status": "ACCESSED",
                    "resource": resource_name,
                    "action": act_type
                }
            else:
                process_states[cycle][pid] = {
                    "status": "WAITING",
                    "resource": resource_name,
                    "action": act_type
                }

    return process_states
