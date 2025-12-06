import { Mic, Pause, Play, Square, X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

function Recorder({ onSave, onCancel }) {
  const [status, setStatus] = useState('idle') // idle, recording, paused
  const [duration, setDuration] = useState(0)
  
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])
  const streamRef = useRef(null)
  const timerRef = useRef(null)

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const cleanup = useCallback(() => {
    clearInterval(timerRef.current)
    streamRef.current?.getTracks().forEach(track => track.stop())
    mediaRecorderRef.current = null
    streamRef.current = null
  }, [])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: true,
        video: false 
      })
      streamRef.current = stream

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm'
      })
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.start(100)
      setStatus('recording')

      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1)
      }, 1000)

    } catch (err) {
      console.error('Microphone error:', err)
      alert('Could not access microphone. Please allow permission.')
    }
  }

  const pauseRecording = () => {
    if (mediaRecorderRef.current && status === 'recording') {
      mediaRecorderRef.current.pause()
      setStatus('paused')
      clearInterval(timerRef.current)
    }
  }

  const resumeRecording = () => {
    if (mediaRecorderRef.current && status === 'paused') {
      mediaRecorderRef.current.resume()
      setStatus('recording')
      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1)
      }, 1000)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && duration > 0) {
      clearInterval(timerRef.current)
      
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        onSave(audioBlob, duration)
      }
      
      mediaRecorderRef.current.stop()
      streamRef.current?.getTracks().forEach(track => track.stop())
    }
  }

  const cancelRecording = () => {
    cleanup()
    onCancel()
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => cleanup()
  }, [cleanup])

  return (
    <div className="bg-dark-800 rounded-2xl border border-dark-700 p-6 mb-6">
      {/* Mic Icon */}
      <div className="flex items-center justify-center mb-6">
        <div className={`w-28 h-28 rounded-full flex items-center justify-center transition-all duration-300 ${
          status === 'recording' 
            ? 'bg-gradient-to-br from-rose-500 to-pink-600 animate-pulse' 
            : status === 'paused'
            ? 'bg-gradient-to-br from-amber-500 to-orange-600'
            : 'bg-dark-700'
        }`}>
          <Mic size={44} className="text-white" />
        </div>
      </div>

      {/* Timer */}
      <div className="text-center mb-6">
        <span className="text-4xl font-mono text-white">{formatDuration(duration)}</span>
        <p className="text-dark-400 text-sm mt-2">
          {status === 'recording' && 'Recording...'}
          {status === 'paused' && 'Paused'}
          {status === 'idle' && 'Tap mic to start'}
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

        {/* Start (when idle) */}
        {status === 'idle' && (
          <button
            onClick={startRecording}
            className="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center transition-colors"
          >
            <Mic size={28} />
          </button>
        )}

        {/* Pause (when recording) */}
        {status === 'recording' && (
          <button
            onClick={pauseRecording}
            className="w-16 h-16 rounded-full bg-amber-600 hover:bg-amber-500 text-white flex items-center justify-center transition-colors"
          >
            <Pause size={28} />
          </button>
        )}
        
        {/* Resume (when paused) */}
        {status === 'paused' && (
          <button
            onClick={resumeRecording}
            className="w-16 h-16 rounded-full bg-green-600 hover:bg-green-500 text-white flex items-center justify-center transition-colors"
          >
            <Play size={28} />
          </button>
        )}

        {/* Stop & Save */}
        <button
          onClick={stopRecording}
          disabled={duration === 0}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
            duration > 0
              ? 'bg-rose-600 hover:bg-rose-500 text-white'
              : 'bg-dark-700 text-dark-500 cursor-not-allowed'
          }`}
        >
          <Square size={22} fill="currentColor" />
        </button>
      </div>

      <p className="text-center text-dark-500 text-xs mt-6">
        {status === 'idle' ? 'Tap the mic to begin' : 'Tap ■ to stop and save'}
      </p>
    </div>
  )
}

export default Recorder