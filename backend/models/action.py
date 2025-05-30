class Action:
    def __init__(self, pid: str, action: str, resource: str, cycle: int):
        self.pid = pid
        self.action = action.upper()
        self.resource = resource
        self.cycle = cycle

    def __repr__(self):
        return f"<Action PID={self.pid}, Action={self.action}, Resource={self.resource}, Cycle={self.cycle}>"
