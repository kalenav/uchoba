from station import Station
from train import Train
from carriage import Carriage
from playarea import PlayArea
from file_writer import FileWriter

class UI():

    def __init__(self):
        pass

    def printPlayareaState(self, playarea):
        print("=======================================================")
        stations = playarea.getStations()
        stations_quantity = len(stations)
        graph = []
        for i in range(stations_quantity):
            graph.append([0] * stations_quantity)
        for index in range(stations_quantity):
            curr_station = stations[index]
            for adjacentIndex in range(stations_quantity):
                curr_adjacent_station = stations[adjacentIndex]
                if(curr_station.isAdjacentTo(curr_adjacent_station)):
                    graph[index][adjacentIndex] = curr_station.getLinkWeight(curr_adjacent_station)
        print("The play area graph has the following appearance:")
        for i in range(stations_quantity):
            curr_row = ""
            for j in range(stations_quantity):
                curr_row += (str(graph[i][j]) + " ")
            print(curr_row)
        print("\nThe stations are as follows:")
        for station in stations:
            curr_str = "Station " + str(station.getId()) + ": "
            if(station.type == 0):
                curr_str += "cargo"
            elif(station.type == 1):
                curr_str += "passenger"
            else:
                curr_str += "cargo/passenger"
            print(curr_str)
        trains = playarea.getTrains()
        print("\nThe trains are as follows:")
        for index in range(len(trains)):
            curr_str = "Train " + str(index) + " "
            curr_train = trains[index]
            if(curr_train.isEnRoute()):
                curr_str += "en route to station " + str(curr_train.getCurrDestination().getId()) + "; " + str(curr_train.turnsLeftToDestination()) + " turns left"
            else:
                curr_str += "is waiting at station " + str(curr_train.getCurrStation().getId()) + "; next station is " + str(curr_train.getCurrDestination().getId())
            print(curr_str)
        print("=======================================================")

    def printTrainInfo(self, playarea, index):
        train = playarea.getTrains()[index]
        if(train.isEnRoute()):
            print("Currently en route to station " + str(train.getCurrDestination().getId()))
        else:
            print("Currently waiting at station " + str(train.getCurrStation().getId()) + "; next destination is station " + str(train.getCurrDestination().getId()))
        print("Current speed: " + str(train.getLocomotive().getSpeed()))
        print("Service time left: " + str(train.getServiceTimeLeft()))
        carriages = train.getCarriages()
        print("Has " + str(len(carriages)) + " carriages")
        for index in range(len(carriages)):
            carriageInfo = "Carriage "
            carriageInfo += str(index + 1) + ": "
            if(carriages[index].isCargo()): 
                carriageInfo += "cargo; "
            else:
                carriageInfo += "passenger; "
            if(carriages[index].isLoaded()):
                carriageInfo += "loaded"
            else:
                carriageInfo +="empty"
            print(carriageInfo)

    def sendTrain(self, playarea, index):
        train = playarea.getTrains()[index]
        if(train.isEnRoute()):
            print("This train is already on its way. It'll get there when it'll get there. Show some patience.")
        else:
            if(train.getLocomotive().getSpeed() <= 0):
                print("This train is overloaded. Consider unloading some of its carriages.")
            else:
                playarea.sendTrain(index)
                print("This train is now en route to its destination. Look at it go! Oh, right, you can't, it's a command line style interface. My bad.")

    def loadTrain(self, playarea, index):
        train = playarea.getTrains()[index]
        if(train.isEnRoute()):
            print("This train is en route to its destination. It's not like you can load it on the fly. There's also nothing to load, it's somewhere in the steppes or in a forest, probably.")
        else:
            train.load()
            print("Empty carriages corresponding with current station type have been loaded.")

    def unloadTrain(self, playarea, index):
        train = playarea.getTrains()[index]
        if(train.isEnRoute()):
            print("This train is en route to its destination. It's not like you can unload it on the fly. There's also nohwere to unload, it's somewhere in the steppes or in a forest, probably. Unless you want to get rid of the cargo, which is utter nonsense.")
        else:
            train.unload()
            print("Loaded carriages corresponding with current station type have been unloaded.")

    def nextTurn(self, playarea):
        playarea.nextTurn()