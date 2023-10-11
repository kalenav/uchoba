from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/decompose', methods=['POST'])
def decompose():
    sentence = request.json['sentence']
    result = '''(TEXT (S
  (NP Белый/ADJF кот/NOUN)
  (PP на/PREP (NP огромной/ADJF скорости/NOUN))
  (VP проскочил/VERB мимо/PREP (NP чёрной/ADJF собаки/NOUN))) )''' # func(sentence)
    return jsonify({'result': result})

if __name__ == '__main__':
    app.run()