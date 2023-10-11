class Carriage():

    def __init__(self, is_cargo, is_loaded):
        self.is_cargo = is_cargo
        self.is_loaded = is_loaded

    def isCargo(self):
        return self.is_cargo

    def isLoaded(self):
        return self.is_loaded

    def load(self):
        self.is_loaded = True

    def unload(self):
        self.is_loaded = False

