import argparse
from UIclass import UI
from file_reader import FileReader
from file_writer import FileWriter
import os

dirname = os.path.dirname(__file__)
filename = os.path.join(dirname, 'examples\\pa1.txt')
fr = FileReader(filename)
playarea = fr.readPlayareaFromFile()

ui = UI()


parser = argparse.ArgumentParser(description='Railroad simulation')

subparsers = parser.add_subparsers()

parser_printState = subparsers.add_parser('print', help='Print current playarea state')
parser_printState.set_defaults(func=ui.printPlayareaState)

parser_trainInfo = subparsers.add_parser('traininfo', help='Print selected train information')
parser_trainInfo.add_argument('id', type=int)
parser_trainInfo.set_defaults(func=ui.printTrainInfo)

parser_sendTrain = subparsers.add_parser('send', help='Send selected train to its next destination')
parser_sendTrain.add_argument('id', type=int)
parser_sendTrain.set_defaults(func=ui.sendTrain)

parser_loadTrain = subparsers.add_parser('load', help='Load selected train')
parser_loadTrain.add_argument('id', type=int)
parser_loadTrain.set_defaults(func=ui.loadTrain)

parser_unloadTrain = subparsers.add_parser('unload', help='Unload selected train')
parser_unloadTrain.add_argument('id', type=int)
parser_unloadTrain.set_defaults(func=ui.unloadTrain)

parser_nextTurn = subparsers.add_parser('next', help='Move to the next turn')
parser_nextTurn.set_defaults(func=ui.nextTurn)


args = parser.parse_args()
callbackArgs = [playarea]
if hasattr(args, 'id'):
    callbackArgs.append(args.id)
args.func(*callbackArgs)

fw = FileWriter(filename, playarea)
fw.writePlayareaToFile()