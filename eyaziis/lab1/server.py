from flask import Flask, request, jsonify
from flask_cors import CORS
from lab import decompose_sentence

app = Flask(__name__)
CORS(app)

@app.route('/decompose', methods=['POST'])
def decompose():
    sentence = request.json['sentence']
    result = decompose_sentence(sentence)
    return jsonify({'result': result})

if __name__ == '__main__':
    app.run()