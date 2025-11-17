from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import librosa
import os
from emotion_model import EmotionRecognizer

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

recognizer = EmotionRecognizer()

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'})

@app.route('/api/predict', methods=['POST'])
def predict_emotion():
    try:
        if 'audio' not in request.files:
            return jsonify({'error': 'No audio file provided'}), 400

        audio_file = request.files['audio']

        if audio_file.filename == '':
            return jsonify({'error': 'No file selected'}), 400

        filepath = os.path.join(UPLOAD_FOLDER, 'temp_audio.wav')
        audio_file.save(filepath)

        emotion, confidence, probabilities = recognizer.predict(filepath)

        os.remove(filepath)

        return jsonify({
            'emotion': emotion,
            'confidence': float(confidence),
            'probabilities': probabilities
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
