import { useState, useRef } from 'react';
import { Mic, Square, Upload, Loader2 } from 'lucide-react';

interface AudioRecorderProps {
  onAnalyze: (audioBlob: Blob) => void;
  isAnalyzing: boolean;
}

export default function AudioRecorder({ onAnalyze, isAnalyzing }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' });
        onAnalyze(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Unable to access microphone. Please grant permission.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onAnalyze(file);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex gap-4">
        {!isRecording ? (
          <button
            onClick={startRecording}
            disabled={isAnalyzing}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            <Mic size={20} />
            Start Recording
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors animate-pulse"
          >
            <Square size={20} />
            Stop Recording
          </button>
        )}

        <label className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer transition-colors disabled:bg-gray-400">
          <Upload size={20} />
          Upload Audio
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileUpload}
            disabled={isAnalyzing || isRecording}
            className="hidden"
          />
        </label>
      </div>

      {isAnalyzing && (
        <div className="flex items-center gap-2 text-blue-600">
          <Loader2 className="animate-spin" size={20} />
          <span>Analyzing emotion...</span>
        </div>
      )}
    </div>
  );
}
