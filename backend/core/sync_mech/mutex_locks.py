from typing import List, Dict, Optional
from models.action import Action
from models.process import Process
from models.resource import Resource

def simulate_mutex(processes: List[Process], resources: List[Resource], actions: List[Action]):
    resource_state: Dict[str, Optional[str]] = {res.name: None for res in resources}
    
    process_states: Dict[int, Dict[str, Dict[str, str]]] = {}
    
    actions.sort(key=lambda x: x.cycle)
    max_cycle = max(action.cycle for action in actions)

    for cycle in range(max_cycle + 1):
        process_states[cycle] = {}
        current_actions = [a for a in actions if a.cycle == cycle]
        
        for action in current_actions:
            pid = action.pid
            resource_name = action.resource
            act_type = action.action

            if resource_state[resource_name] is None:
                resource_state[resource_name] = pid
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

        for action in current_actions:
            resource_name = action.resource
            if resource_state[resource_name] == action.pid:
                resource_state[resource_name] = None
    
    return process_states
