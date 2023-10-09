from locomotive import Locomotive
from math import ceil

class Train():

    def __init__(self, locomotive_speed, locomotive_service_time_left, carriages, path):
        self.locomotive = Locomotive(locomotive_speed, locomotive_service_time_left)
        self.carriages = []
        for curr_carriage in carriages:
            self.carriages.append(curr_carriage)
        self.path = path.copy()
        self.curr_station = path[0]
        self.curr_station_type = path[0].getType()
        self.curr_station_in_path_index = 0
        self.curr_destination = path[1]
        self.curr_distance_to_destination = self.curr_station.getLinkWeight(self.curr_destination)
        self.en_route = False
        self.broken = False

    def setCurrStation(self, input):
        self.curr_station = input

    def setCurrStationType(self, input):
        self.curr_station_type = input

    def setCurrDestination(self, input):
        self.curr_destination = input

    def setCurrDistanceToDestination(self, input):
        self.curr_distance_to_destination = input

    def send(self):
        self.en_route = True

    def stop(self):
        self.en_route = False
        self.advance()

    def advance(self):
        self.curr_station = self.curr_destination
        newDestinationIndex = (self.curr_station_in_path_index + 1) % len(self.path)
        self.curr_station_in_path_index = newDestinationIndex
        self.curr_destination = self.path[(newDestinationIndex + 1) % len(self.path)]
        self.curr_distance_to_destination = self.curr_station.getLinkWeight(self.curr_destination)

    def load(self):
        for carriage in self.carriages:
            if(carriage.isCargo() and not carriage.isLoaded() and self.curr_station_type != 1):
                carriage.load()
                self.locomotive.decreaseSpeedByOne()
            if(not carriage.isCargo() and not carriage.isLoaded() and self.curr_station_type != 0):
                carriage.load()
                self.locomotive.decreaseSpeedByOne()
    
    def unload(self):
        for carriage in self.carriages:
            if(carriage.isCargo() and carriage.isLoaded() and self.curr_station_type != 1):
                carriage.unload()
                self.locomotive.increaseSpeedByOne()
            if(not carriage.isCargo() and carriage.isLoaded() and self.curr_station_type != 0):
                carriage.unload()
                self.locomotive.increaseSpeedByOne()

    def disintegrate(self):
        self.broken = True

    def getSpeed(self):
        return self.getLocomotive().getSpeed()
    
    def getLocomotive(self):
        return self.locomotive

    def getCarriages(self):
        return self.carriages

    def getPath(self):
        return self.path

    def isEnRoute(self):
        return self.en_route

    def isBroken(self):
        return self.broken

    def getCurrStation(self):
        return self.curr_station

    def getCurrStationType(self):
        return self.curr_station_type
    
    def getCurrDestination(self):
        return self.curr_destination

    def getCurrDistanceToDestination(self):
        return self.curr_distance_to_destination

    def getServiceTimeLeft(self):
        return self.locomotive.getServiceTimeLeft()

    def turnsLeftToDestination(self):
        return ceil(self.curr_distance_to_destination / self.locomotive.getSpeed())