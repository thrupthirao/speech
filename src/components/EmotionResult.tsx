import { Smile, Frown, Angry, Meh, Heart, AlertTriangle, XCircle, Zap } from 'lucide-react';

interface EmotionResultProps {
  emotion: string;
  confidence: number;
  probabilities: Record<string, number>;
}

const emotionIcons: Record<string, React.ReactNode> = {
  happy: <Smile size={48} className="text-yellow-500" />,
  sad: <Frown size={48} className="text-blue-500" />,
  angry: <Angry size={48} className="text-red-500" />,
  neutral: <Meh size={48} className="text-gray-500" />,
  calm: <Heart size={48} className="text-green-500" />,
  fearful: <AlertTriangle size={48} className="text-orange-500" />,
  disgust: <XCircle size={48} className="text-purple-500" />,
  surprised: <Zap size={48} className="text-pink-500" />,
};

const emotionColors: Record<string, string> = {
  happy: 'bg-yellow-100 border-yellow-300',
  sad: 'bg-blue-100 border-blue-300',
  angry: 'bg-red-100 border-red-300',
  neutral: 'bg-gray-100 border-gray-300',
  calm: 'bg-green-100 border-green-300',
  fearful: 'bg-orange-100 border-orange-300',
  disgust: 'bg-purple-100 border-purple-300',
  surprised: 'bg-pink-100 border-pink-300',
};

export default function EmotionResult({ emotion, confidence, probabilities }: EmotionResultProps) {
  return (
    <div className="w-full max-w-2xl mt-8 space-y-6">
      <div className={`p-8 rounded-xl border-2 ${emotionColors[emotion] || 'bg-gray-100 border-gray-300'} transition-all`}>
        <div className="flex items-center justify-center gap-4 mb-4">
          {emotionIcons[emotion]}
          <div>
            <h2 className="text-3xl font-bold capitalize">{emotion}</h2>
            <p className="text-lg text-gray-600">
              Confidence: {(confidence * 100).toFixed(1)}%
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Emotion Probabilities</h3>
        <div className="space-y-3">
          {Object.entries(probabilities)
            .sort(([, a], [, b]) => b - a)
            .map(([emo, prob]) => (
              <div key={emo} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="capitalize font-medium">{emo}</span>
                  <span className="text-gray-600">{(prob * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${prob * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
