import { Mic, Pause, Play, Square, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

function Recorder({ onSave, onCancel }) {
  const [status, setStatus] = useState('idle') // idle, recording, paused
  const [duration, setDuration] = useState(0)
  const [audioLevel, setAudioLevel] = useState(0)
  
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])
  const streamRef = useRef(null)
  const timerRef = useRef(null)
  const analyserRef = useRef(null)
  const animationRef = useRef(null)

  // Format duration to MM:SS
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      // Setup audio analyser for visualization
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      const analyser = audioContext.createAnalyser()
      const source = audioContext.createMediaStreamSource(stream)
      source.connect(analyser)
      analyser.fftSize = 256
      analyserRef.current = analyser

      // Start level monitoring
      monitorAudioLevel()

      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.start(100) // Collect data every 100ms
      setStatus('recording')

      // Start timer
      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1)
      }, 1000)
    } catch (error) {
      console.error('Error accessing microphone:', error)
      alert('Could not access microphone. Please check permissions.')
    }
  }

  // Monitor audio level for visualization
  const monitorAudioLevel = () => {
    if (!analyserRef.current) return

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)
    
    const updateLevel = () => {
      if (analyserRef.current && status !== 'idle') {
        analyserRef.current.getByteFrequencyData(dataArray)
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length
        setAudioLevel(average / 255)
        animationRef.current = requestAnimationFrame(updateLevel)
      }
    }
    
    updateLevel()
  }

  // Pause recording
  const pauseRecording = () => {
    if (mediaRecorderRef.current && status === 'recording') {
      mediaRecorderRef.current.pause()
      setStatus('paused')
      clearInterval(timerRef.current)
      cancelAnimationFrame(animationRef.current)
    }
  }

  // Resume recording
  const resumeRecording = () => {
    if (mediaRecorderRef.current && status === 'paused') {
      mediaRecorderRef.current.resume()
      setStatus('recording')
      
      // Resume timer
      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1)
      }, 1000)

      // Resume level monitoring
      monitorAudioLevel()
    }
  }

  // Stop and save recording
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        onSave(audioBlob, duration)
        cleanup()
      }
      mediaRecorderRef.current.stop()
    }
  }

  // Cancel recording
  const cancelRecording = () => {
    cleanup()
    onCancel()
  }

  // Cleanup resources
  const cleanup = () => {
    clearInterval(timerRef.current)
    cancelAnimationFrame(animationRef.current)
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
    }
    
    setStatus('idle')
    setDuration(0)
    setAudioLevel(0)
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup()
    }
  }, [])

  // Auto-start recording when component mounts
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    startRecording()
  }, [])

  return (
    <div className="bg-dark-800 rounded-2xl border border-dark-700 p-6 mb-6">
      {/* Visualizer */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative">
          {/* Animated rings */}
          <div 
            className={`absolute inset-0 rounded-full bg-rose-500/20 transition-transform duration-100 ${status === 'recording' ? 'animate-ping' : ''}`}
            style={{ 
              transform: `scale(${1 + audioLevel * 0.5})`,
              opacity: status === 'recording' ? 0.5 : 0
            }}
          />
          <div 
            className={`absolute inset-0 rounded-full bg-rose-500/30 transition-transform duration-100`}
            style={{ 
              transform: `scale(${1 + audioLevel * 0.3})`,
              opacity: status === 'recording' ? 0.7 : 0
            }}
          />
          
          {/* Main circle */}
          <div className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 ${
            status === 'recording' 
              ? 'bg-gradient-to-br from-rose-500 to-pink-600' 
              : status === 'paused'
              ? 'bg-gradient-to-br from-amber-500 to-orange-600'
              : 'bg-dark-700'
          }`}>
            <Mic size={48} className="text-white" />
          </div>
        </div>
      </div>

      {/* Duration */}
      <div className="text-center mb-6">
        <span className="text-4xl font-mono text-white">{formatDuration(duration)}</span>
        <p className="text-dark-400 text-sm mt-2">
          {status === 'recording' && 'Recording...'}
          {status === 'paused' && 'Paused'}
          {status === 'idle' && 'Ready'}
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        {/* Cancel */}
        <button
          onClick={cancelRecording}
          className="w-14 h-14 rounded-full bg-dark-700 hover:bg-dark-600 text-dark-300 hover:text-white flex items-center justify-center transition-colors"
        >
          <X size={24} />
        </button>

        {/* Pause/Resume */}
        {status === 'recording' ? (
          <button
            onClick={pauseRecording}
            className="w-16 h-16 rounded-full bg-amber-600 hover:bg-amber-500 text-white flex items-center justify-center transition-colors"
          >
            <Pause size={28} />
          </button>
        ) : status === 'paused' ? (
          <button
            onClick={resumeRecording}
            className="w-16 h-16 rounded-full bg-green-600 hover:bg-green-500 text-white flex items-center justify-center transition-colors"
          >
            <Play size={28} />
          </button>
        ) : null}

        {/* Stop/Save */}
        <button
          onClick={stopRecording}
          disabled={duration === 0}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
            duration > 0
              ? 'bg-rose-600 hover:bg-rose-500 text-white'
              : 'bg-dark-700 text-dark-500 cursor-not-allowed'
          }`}
        >
          <Square size={24} />
        </button>
      </div>

      {/* Instructions */}
      <p className="text-center text-dark-500 text-xs mt-6">
        Press the square button to stop and save
      </p>
    </div>
  )
}

export default Recorder