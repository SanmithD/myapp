import { ArrowLeftRight, Copy, X } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'

function BaseConverter({ initialValue, onClose }) {
  const [decimal, setDecimal] = useState('')
  const [binary, setBinary] = useState('')
  const [octal, setOctal] = useState('')
  const [hex, setHex] = useState('')
  const [activeInput, setActiveInput] = useState('decimal')

  // Declare all update functions FIRST (before useEffect)
  const updateAllFromDecimal = useCallback((value) => {
    const num = parseInt(value, 10)
    if (isNaN(num) || num < 0) {
      setDecimal(value)
      setBinary('')
      setOctal('')
      setHex('')
      return
    }
    setDecimal(value)
    setBinary(num.toString(2))
    setOctal(num.toString(8))
    setHex(num.toString(16).toUpperCase())
  }, [])

  const updateAllFromBinary = useCallback((value) => {
    if (!/^[01]*$/.test(value)) return
    setBinary(value)
    if (!value) {
      setDecimal('')
      setOctal('')
      setHex('')
      return
    }
    const num = parseInt(value, 2)
    setDecimal(num.toString())
    setOctal(num.toString(8))
    setHex(num.toString(16).toUpperCase())
  }, [])

  const updateAllFromOctal = useCallback((value) => {
    if (!/^[0-7]*$/.test(value)) return
    setOctal(value)
    if (!value) {
      setDecimal('')
      setBinary('')
      setHex('')
      return
    }
    const num = parseInt(value, 8)
    setDecimal(num.toString())
    setBinary(num.toString(2))
    setHex(num.toString(16).toUpperCase())
  }, [])

  const updateAllFromHex = useCallback((value) => {
    if (!/^[0-9A-Fa-f]*$/.test(value)) return
    setHex(value.toUpperCase())
    if (!value) {
      setDecimal('')
      setBinary('')
      setOctal('')
      return
    }
    const num = parseInt(value, 16)
    setDecimal(num.toString())
    setBinary(num.toString(2))
    setOctal(num.toString(8))
  }, [])

  // NOW use the effect after functions are declared
  useEffect(() => {
    const num = parseInt(initialValue)
    if (!isNaN(num) && num >= 0 && Number.isInteger(num)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      updateAllFromDecimal(num.toString())
    }
  }, [initialValue, updateAllFromDecimal])

  const copyValue = async (value, label) => {
    try {
      await navigator.clipboard.writeText(value)
      toast.success(`${label} copied!`)
    } catch {
      toast.error('Failed to copy')
    }
  }

  const bases = [
    { 
      label: 'Decimal (Base 10)', 
      value: decimal, 
      onChange: updateAllFromDecimal, 
      placeholder: 'Enter decimal...',
      key: 'decimal'
    },
    { 
      label: 'Binary (Base 2)', 
      value: binary, 
      onChange: updateAllFromBinary, 
      placeholder: '0 and 1 only...',
      key: 'binary'
    },
    { 
      label: 'Octal (Base 8)', 
      value: octal, 
      onChange: updateAllFromOctal, 
      placeholder: '0-7 only...',
      key: 'octal'
    },
    { 
      label: 'Hexadecimal (Base 16)', 
      value: hex, 
      onChange: updateAllFromHex, 
      placeholder: '0-9, A-F...',
      key: 'hex'
    },
  ]

  return (
    <div className="fixed inset-0 z-50 bg-dark-900/95 backdrop-blur">
      <div className="h-full flex flex-col max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center h-14 justify-between p-4 border-b border-dark-700">
          <div className="flex items-center gap-2">
            <ArrowLeftRight size={20} className="text-dark-400" />
            <h2 className="text-lg font-semibold text-white">Base Converter</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-dark-700 text-dark-300 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Converter */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <p className="text-sm text-dark-400">
            Enter a value in any base to convert to all other bases.
            Only positive integers are supported.
          </p>

          {bases.map((base) => (
            <div key={base.key} className="space-y-2">
              <label className="text-sm font-medium text-dark-300">
                {base.label}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={base.value}
                  onChange={(e) => base.onChange(e.target.value)}
                  onFocus={() => setActiveInput(base.key)}
                  placeholder={base.placeholder}
                  className={`flex-1 px-4 py-3 bg-dark-800 border rounded-lg font-mono text-lg focus:outline-none transition-colors ${
                    activeInput === base.key
                      ? 'border-primary-500 text-white'
                      : 'border-dark-700 text-dark-200'
                  }`}
                />
                <button
                  onClick={() => copyValue(base.value, base.label.split(' ')[0])}
                  disabled={!base.value}
                  className="px-3 bg-dark-700 rounded-lg text-dark-300 hover:text-white transition-colors disabled:opacity-50"
                >
                  <Copy size={18} />
                </button>
              </div>
            </div>
          ))}

          {/* Common values reference */}
          <div className="mt-8 p-4 bg-dark-800 rounded-lg border border-dark-700">
            <h3 className="text-sm font-medium text-dark-300 mb-3">Quick Reference</h3>
            <div className="grid grid-cols-4 gap-2 text-xs font-mono">
              <div className="text-dark-500">Dec</div>
              <div className="text-dark-500">Bin</div>
              <div className="text-dark-500">Oct</div>
              <div className="text-dark-500">Hex</div>
              {[
                [10, '1010', '12', 'A'],
                [16, '10000', '20', '10'],
                [255, '11111111', '377', 'FF'],
                [256, '100000000', '400', '100'],
              ].map(([d, b, o, h], i) => (
                <div key={i} className="contents">
                  <div className="text-dark-300">{d}</div>
                  <div className="text-dark-300">{b}</div>
                  <div className="text-dark-300">{o}</div>
                  <div className="text-dark-300">{h}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BaseConverter