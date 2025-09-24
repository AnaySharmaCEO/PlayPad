import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Mic, MicOff, Volume2, VolumeX, Play, Pause, Settings } from 'lucide-react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
import { WaveformAnimation } from './WaveformAnimation';
import { motion } from 'motion/react';

interface VoiceInterfaceProps {}

export const VoiceInterface: React.FC<VoiceInterfaceProps> = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  
  const {
    transcript,
    isListening,
    error: speechError,
    startListening,
    stopListening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition({
    continuous: true,
    interimResults: true,
  });

  const {
    speak,
    cancel: cancelSpeech,
    pause: pauseSpeech,
    resume: resumeSpeech,
    isSpeaking,
    isPaused,
    isSupported: ttsSupported,
  } = useTextToSpeech();

  // Handle user speech
  useEffect(() => {
    if (transcript && !isListening && transcript.trim().split(' ').length > 3) {
      fetch('http://localhost:5000/api/voicechat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: transcript.trim() }),
      })
        .then((response) => response.json())
        .then((data) => {
          setAiResponse(data.response);
          if (data.response) {
            speak(data.response);
          }
        })
        .catch((error) => {
          console.error('Error:', error);
          const errorMessage = 'Sorry, I encountered an error. Please try again.';
          setAiResponse(errorMessage);
          speak(errorMessage);
        });
    }
  }, [transcript, isListening, speak]);

  const handleStartRecording = () => {
    resetTranscript();
    startListening();
    setIsRecording(true);
  };

  const handleStopRecording = () => {
    stopListening();
    setIsRecording(false);
  };

  const handleSpeakResponse = () => {
    if (aiResponse) {
      speak(aiResponse);
    }
  };

  const handleStopSpeaking = () => {
    cancelSpeech();
  };

  if (!browserSupportsSpeechRecognition) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto px-4 py-8"
      >
        <Card className="rounded-xl border-border/50">
          <CardContent className="p-8 text-center">
            <MicOff className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg mb-2">Speech Recognition Not Supported</h3>
            <p className="text-muted-foreground">
              Your browser doesn't support speech recognition. Please use a modern browser like Chrome or Edge.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-5xl mx-auto px-4 py-8"
    >
      {/* Header */}
      <div className="text-center mb-12">
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-3xl mb-4">Voice Mode</h2>
          <p className="text-lg text-muted-foreground mb-6">
            Speak naturally with your AI assistant
          </p>
        </motion.div>
      </div>

      {/* Central Microphone */}
      <div className="flex justify-center mb-12">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
          className="relative"
        >
          {/* Pulsing Ring */}
          {isListening && (
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-primary"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.8, 0.3, 0.8],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{ margin: '-8px' }}
            />
          )}
          
          {/* Main Mic Button */}
          <Button
            size="lg"
            variant={isRecording ? "destructive" : "default"}
            onClick={isRecording ? handleStopRecording : handleStartRecording}
            className="w-32 h-32 rounded-full text-white shadow-2xl hover:scale-105 transition-all duration-200"
            disabled={!!speechError}
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center"
            >
              {isRecording ? (
                <MicOff className="h-12 w-12 mb-2" />
              ) : (
                <Mic className="h-12 w-12 mb-2" />
              )}
              
              {/* Waveform Animation */}
              {isListening && (
                <WaveformAnimation isActive={isListening} barCount={5} />
              )}
            </motion.div>
          </Button>
        </motion.div>
      </div>

      {/* Status Display */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-center mb-8"
      >
        <div className="text-lg mb-2">
          {isListening ? (
            <span className="text-green-600 dark:text-green-400">🎙️ Listening...</span>
          ) : isRecording ? (
            <span className="text-yellow-600 dark:text-yellow-400">⏳ Starting...</span>
          ) : (
            <span className="text-muted-foreground">🎯 Ready to listen</span>
          )}
        </div>
        
        {speechError && (
          <div className="text-sm text-destructive">
            ❌ {speechError}
          </div>
        )}
      </motion.div>

      {/* Voice Controls Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      >
        {/* Voice Settings */}
        <Card className="rounded-xl border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center text-sm">
              <Settings className="h-4 w-4 mr-2" />
              Voice Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-center">
              <div className="text-xs text-muted-foreground mb-1">Language</div>
              <div className="text-sm">English (US)</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-muted-foreground mb-1">Continuous Mode</div>
              <div className="text-sm">Enabled</div>
            </div>
          </CardContent>
        </Card>

        {/* Speech Output Control */}
        <Card className="rounded-xl border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center text-sm">
              <Volume2 className="h-4 w-4 mr-2" />
              Voice Output
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-center">
              {!ttsSupported ? (
                <Button size="sm" variant="outline" disabled className="rounded-full">
                  <VolumeX className="h-4 w-4" />
                </Button>
              ) : isSpeaking ? (
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={isPaused ? resumeSpeech : pauseSpeech}
                    className="rounded-full"
                  >
                    {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={handleStopSpeaking}
                    className="rounded-full"
                  >
                    <VolumeX className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleSpeakResponse}
                  disabled={!aiResponse}
                  className="rounded-full"
                >
                  <Volume2 className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            <div className="text-center text-xs text-muted-foreground">
              {!ttsSupported ? (
                'TTS not supported'
              ) : isSpeaking ? (
                isPaused ? 'Paused' : 'Speaking...'
              ) : (
                aiResponse ? 'Click to hear response' : 'Waiting for response'
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="rounded-xl border-border/50">
          <CardHeader>
            <CardTitle className="text-sm">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full rounded-xl text-xs"
              onClick={() => {
                resetTranscript();
                setAiResponse('');
              }}
            >
              Clear Conversation
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full rounded-xl text-xs"
              disabled={!transcript}
            >
              Save Transcript
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Live Conversation Display */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="rounded-xl border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mic className="h-5 w-5 mr-2" />
              Live Conversation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {transcript && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex justify-end"
                >
                  <div className="bg-primary text-primary-foreground rounded-xl px-4 py-3 max-w-lg shadow-lg">
                    <div className="text-xs opacity-80 mb-1">You</div>
                    <div className="text-sm">{transcript}</div>
                  </div>
                </motion.div>
              )}
              
              {aiResponse && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-muted text-foreground rounded-xl px-4 py-3 max-w-lg shadow-lg">
                    <div className="text-xs text-muted-foreground mb-1">AI Assistant</div>
                    <div className="text-sm">{aiResponse}</div>
                  </div>
                </motion.div>
              )}
              
              {!transcript && !aiResponse && (
                <div className="text-center text-muted-foreground py-12">
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Mic className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  </motion.div>
                  <h3 className="text-lg mb-2">Ready to chat</h3>
                  <p>Press the microphone button and start speaking</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};