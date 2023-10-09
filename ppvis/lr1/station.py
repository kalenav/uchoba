class Station:
    def __init__(self, id, type):
        self.id = id
        self.type = type
        self.adjacent = []
        self.weights = []

    def getId(self):
        return self.id

    def getType(self):
        return self.type

    def isAdjacentTo(self, adjacent):
        for currAdjacent in self.adjacent:
            if(currAdjacent == adjacent): 
                return True
        return False

    def getLinkWeight(self, adjacent):
        for index in range(len(self.adjacent)):
            if(self.adjacent[index] == adjacent):
                return self.weights[index]

    def addAdjacent(self, adjacent, weight):
        self.adjacent.append(adjacent)
        self.weights.append(weight)