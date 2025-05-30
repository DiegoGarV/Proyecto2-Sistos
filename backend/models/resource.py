class Resource:
    def __init__(self, name: str, counter: int):
        self.name = name
        self.counter = counter

    def __repr__(self):
        return f"<Resource {self.name}: Counter={self.counter}>"
