from cgi import print_arguments
from carriage import Carriage
from train import Train
from station import Station
from playarea import PlayArea

class FileReader:
    def __init__(self, path):
        self.file = open(path, 'r')

    def __readIntUntilLimiter(self, string, index, limiters):
        toConvert = ''
        while(index < len(string) and not string[index] in limiters):
            toConvert += string[index]
            index += 1
        return { 'integer': int(toConvert), 'finishedAt': index }

    def __readCarriageInfo(self, string, index):
        isCargo = string[index] == 'Y'
        isLoaded = string[index + 2] == 'Y'
        return { 'isCargo': isCargo, 'isLoaded': isLoaded  }

    def readPlayareaFromFile(self):
        inputFileSplit = self.file.read().split('_')
        if(inputFileSplit[0] == ''):
            return PlayArea([], [])

        stationsLines = inputFileSplit[0].strip().split('\n')
        stations = []

        for line in stationsLines:
            currStationIdReadResult = self.__readIntUntilLimiter(line, 0, ['('])
            currStationId = currStationIdReadResult['integer']
            currStationType = int(line[currStationIdReadResult['finishedAt'] + 1])
            stations.append(Station(currStationId, currStationType))

        for line in stationsLines:
            currStationIdReadResult = self.__readIntUntilLimiter(line, 0, ['('])
            currStation = stations[currStationIdReadResult['integer'] - 1]
            currSymbolIndex = currStationIdReadResult['finishedAt'] + 5
            while(currSymbolIndex < len(line)):
                currAdjacentStationIdReadResult = self.__readIntUntilLimiter(line, currSymbolIndex, ['('])
                currAdjacentStation = stations[currAdjacentStationIdReadResult['integer'] - 1]
                currSymbolIndex = currAdjacentStationIdReadResult['finishedAt'] + 1
                currAdjacentStationLinkWeightReadResult = self.__readIntUntilLimiter(line, currSymbolIndex, [')'])
                currAdjacentStationLinkWeight = currAdjacentStationLinkWeightReadResult['integer']
                currSymbolIndex = currAdjacentStationLinkWeightReadResult['finishedAt'] + 3
                currStation.addAdjacent(currAdjacentStation, currAdjacentStationLinkWeight)


        trainsLines = inputFileSplit[1].strip().split('\n')
        trains = []

        for line in trainsLines:
            trainSpeedReadResult = self.__readIntUntilLimiter(line, 0, [','])
            trainSpeed = trainSpeedReadResult['integer']
            trainServiceTimeLeftReadResult = self.__readIntUntilLimiter(line, trainSpeedReadResult['finishedAt'] + 2, [','])
            trainServiceTimeLeft = trainServiceTimeLeftReadResult['integer']
            currSymbolIndex = trainServiceTimeLeftReadResult['finishedAt'] + 3
            carriages = []
            currCarriageReadResult = self.__readCarriageInfo(line, currSymbolIndex)
            carriages.append(Carriage(currCarriageReadResult['isCargo'], currCarriageReadResult['isLoaded']))
            currSymbolIndex += 5
            while(line[currSymbolIndex] != ' '):
                currCarriageReadResult = self.__readCarriageInfo(line, currSymbolIndex)
                carriages.append(Carriage(currCarriageReadResult['isCargo'], currCarriageReadResult['isLoaded']))
                currSymbolIndex += 5
            currSymbolIndex += 2
            path = []
            while(True):
                currStationReadResult = self.__readIntUntilLimiter(line, currSymbolIndex, [',', ')'])
                path.append(stations[currStationReadResult['integer'] - 1])
                currSymbolIndex = currStationReadResult['finishedAt'] + 2
                if(line[currStationReadResult['finishedAt']] == ')'):
                    break
            currTrain = Train(trainSpeed, trainServiceTimeLeft, carriages, path)
            currReadResult = self.__readIntUntilLimiter(line, currSymbolIndex, [','])
            currTrain.setCurrStation(stations[currReadResult['integer'] - 1])
            currSymbolIndex = currReadResult['finishedAt'] + 2
            currReadResult = self.__readIntUntilLimiter(line, currSymbolIndex, [','])
            currTrain.setCurrStationType(currReadResult['integer'])
            currSymbolIndex = currReadResult['finishedAt'] + 2
            currReadResult = self.__readIntUntilLimiter(line, currSymbolIndex, [','])
            currTrain.setCurrDestination(stations[currReadResult['integer'] - 1])
            currSymbolIndex = currReadResult['finishedAt'] + 2
            currReadResult = self.__readIntUntilLimiter(line, currSymbolIndex, [','])
            currTrain.setCurrDistanceToDestination(currReadResult['integer'])
            currSymbolIndex = currReadResult['finishedAt'] + 2
            if(line[currSymbolIndex] == 'Y'):
                currTrain.send()
            trains.append(currTrain)


        return PlayArea(stations, trains)
