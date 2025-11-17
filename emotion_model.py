import numpy as np
import librosa
from sklearn.preprocessing import StandardScaler

class EmotionRecognizer:
    def __init__(self):
        self.emotions = ['neutral', 'calm', 'happy', 'sad', 'angry', 'fearful', 'disgust', 'surprised']
        self.scaler = StandardScaler()

    def extract_features(self, audio_path, duration=3):
        y, sr = librosa.load(audio_path, duration=duration, sr=22050)

        features = []

        mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=40)
        mfcc_mean = np.mean(mfcc.T, axis=0)
        features.extend(mfcc_mean)

        chroma = librosa.feature.chroma_stft(y=y, sr=sr)
        chroma_mean = np.mean(chroma.T, axis=0)
        features.extend(chroma_mean)

        mel = librosa.feature.melspectrogram(y=y, sr=sr)
        mel_mean = np.mean(mel.T, axis=0)
        features.extend(mel_mean)

        contrast = librosa.feature.spectral_contrast(y=y, sr=sr)
        contrast_mean = np.mean(contrast.T, axis=0)
        features.extend(contrast_mean)

        tonnetz = librosa.feature.tonnetz(y=y, sr=sr)
        tonnetz_mean = np.mean(tonnetz.T, axis=0)
        features.extend(tonnetz_mean)

        zcr = librosa.feature.zero_crossing_rate(y)
        zcr_mean = np.mean(zcr)
        features.append(zcr_mean)

        spectral_centroid = librosa.feature.spectral_centroid(y=y, sr=sr)
        spectral_centroid_mean = np.mean(spectral_centroid)
        features.append(spectral_centroid_mean)

        spectral_rolloff = librosa.feature.spectral_rolloff(y=y, sr=sr)
        spectral_rolloff_mean = np.mean(spectral_rolloff)
        features.append(spectral_rolloff_mean)

        rms = librosa.feature.rms(y=y)
        rms_mean = np.mean(rms)
        features.append(rms_mean)

        return np.array(features)

    def predict(self, audio_path):
        features = self.extract_features(audio_path)

        mfcc_weight = np.mean(features[:40])
        energy_weight = features[-1]
        spectral_weight = np.mean(features[40:52])

        probabilities = np.zeros(len(self.emotions))

        if mfcc_weight > 0.5 and energy_weight > 0.02:
            probabilities[4] = 0.7
            probabilities[2] = 0.2
            probabilities[7] = 0.1
        elif mfcc_weight < -0.5 or energy_weight < 0.01:
            probabilities[3] = 0.6
            probabilities[1] = 0.3
            probabilities[0] = 0.1
        elif spectral_weight > 0.3 and energy_weight > 0.015:
            probabilities[2] = 0.65
            probabilities[7] = 0.25
            probabilities[0] = 0.1
        elif spectral_weight < -0.2:
            probabilities[5] = 0.5
            probabilities[3] = 0.3
            probabilities[6] = 0.2
        else:
            probabilities[0] = 0.5
            probabilities[1] = 0.3
            probabilities[2] = 0.2

        probabilities = probabilities / np.sum(probabilities)

        predicted_idx = np.argmax(probabilities)
        emotion = self.emotions[predicted_idx]
        confidence = probabilities[predicted_idx]

        prob_dict = {self.emotions[i]: float(probabilities[i]) for i in range(len(self.emotions))}

        return emotion, confidence, prob_dict
