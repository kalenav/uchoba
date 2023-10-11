class Locomotive():

    def __init__(self, speed, service_time_left):
        self.speed = speed
        self.service_time_left = service_time_left

    def increaseSpeedByOne(self):
        self.speed += 1

    def decreaseSpeedByOne(self):
        self.speed -= 1

    def reduceServiceTimeLeftBy(self, reduceBy):
        self.service_time_left -= reduceBy

    def getSpeed(self):
        return self.speed

    def getServiceTimeLeft(self):
        return self.service_time_left
