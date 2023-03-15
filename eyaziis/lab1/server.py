from flask import Flask, request, jsonify
from flask_cors import CORS
from lab import decompose_sentence, apply_morphological_traits_to_word, DATA

app = Flask(__name__)
CORS(app)

@app.route('/decompose', methods=['POST'])
def decompose():
    sentence = request.json['sentence']
    result = decompose_sentence(sentence)
    return jsonify({'result': result})

@app.route('/morph', methods=['POST'])
def morph():
    word = request.json['word']
    traits = { trait for trait in request.json['traits'] }
    result = apply_morphological_traits_to_word(word, traits)
    return jsonify({'result': result})

@app.route('/dict', methods=['GET'])
def dict():
    return jsonify({'result': DATA})

@app.route('/updatedict', methods=['POST'])
def updatedict():
    new_dict = request.json['newDictionary']
    # здесь меняем словарь внутри пайтона
    return jsonify({'result': DATA})


if __name__ == '__main__':
    app.run()