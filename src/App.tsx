import { useState } from 'react';
import { Brain } from 'lucide-react';
import AudioRecorder from './components/AudioRecorder';
import EmotionResult from './components/EmotionResult';

interface EmotionData {
  emotion: string;
  confidence: number;
  probabilities: Record<string, number>;
}

function App() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<EmotionData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeAudio = async (audioBlob: Blob) => {
    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'audio.wav');

      const response = await fetch('http://localhost:5000/api/predict', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to analyze audio');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error analyzing audio:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-3 mb-4">
            <Brain size={48} className="text-blue-600" />
            <h1 className="text-5xl font-bold text-gray-800">
              Speech Emotion Recognition
            </h1>
          </div>

          <p className="text-xl text-gray-600 mb-12 text-center max-w-2xl">
            Analyze emotions from speech using advanced audio processing and machine learning
          </p>

          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-4xl">
            <AudioRecorder onAnalyze={analyzeAudio} isAnalyzing={isAnalyzing} />

            {error && (
              <div className="mt-6 p-4 bg-red-100 border border-red-300 rounded-lg text-red-700">
                <p className="font-semibold">Error:</p>
                <p>{error}</p>
                <p className="text-sm mt-2">Make sure the Flask server is running on port 5000</p>
              </div>
            )}

            {result && (
              <EmotionResult
                emotion={result.emotion}
                confidence={result.confidence}
                probabilities={result.probabilities}
              />
            )}
          </div>

          <div className="mt-12 bg-white rounded-xl shadow-md p-6 max-w-4xl">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">How to Use</h2>
            <ol className="space-y-3 text-gray-700">
              <li className="flex gap-3">
                <span className="font-bold text-blue-600">1.</span>
                <span>Start the Flask backend server by running: <code className="bg-gray-100 px-2 py-1 rounded">python app.py</code></span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-blue-600">2.</span>
                <span>Click "Start Recording" to record your voice or "Upload Audio" to analyze an existing audio file</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-blue-600">3.</span>
                <span>Speak clearly for 2-3 seconds expressing an emotion</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-blue-600">4.</span>
                <span>Click "Stop Recording" and wait for the analysis</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-blue-600">5.</span>
                <span>View the detected emotion with confidence scores and probability distribution</span>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
