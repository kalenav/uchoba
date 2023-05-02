from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/decompose', methods=['POST'])
def decompose():
    sentence = request.json['sentence']
    result = [
        {
            'word': 'bruh',
            'Syn': 'cringe'
        },
        {
            'word': 'cringe',
            'Syn': 'bruh',
            'Ant': 'based'
        }
    ] # func(sentence)
    return jsonify({'result': result})

if __name__ == '__main__':
    app.run()