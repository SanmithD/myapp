/* eslint-disable react-hooks/set-state-in-effect */
import {
    Binary,
    Clock,
    Droplets,
    Ruler,
    Scale,
    Thermometer,
    X
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'

/* =========================
   CONVERSION CONFIG
========================= */

const CONVERSIONS = {
  length: {
    name: 'Length',
    icon: Ruler,
    baseUnit: 'meter',
    units: {
      meter: { name: 'Meter', symbol: 'm', toBase: 1 },
      kilometer: { name: 'Kilometer', symbol: 'km', toBase: 1000 },
      centimeter: { name: 'Centimeter', symbol: 'cm', toBase: 0.01 },
      millimeter: { name: 'Millimeter', symbol: 'mm', toBase: 0.001 },
      inch: { name: 'Inch', symbol: 'in', toBase: 0.0254 },
      foot: { name: 'Foot', symbol: 'ft', toBase: 0.3048 },
      mile: { name: 'Mile', symbol: 'mi', toBase: 1609.344 },
    },
  },
  mass: {
    name: 'Mass',
    icon: Scale,
    baseUnit: 'kilogram',
    units: {
      kilogram: { name: 'Kilogram', symbol: 'kg', toBase: 1 },
      gram: { name: 'Gram', symbol: 'g', toBase: 0.001 },
      pound: { name: 'Pound', symbol: 'lb', toBase: 0.453592 },
      ounce: { name: 'Ounce', symbol: 'oz', toBase: 0.0283495 },
    },
  },
  temperature: {
    name: 'Temperature',
    icon: Thermometer,
    units: {
      celsius: { name: 'Celsius', symbol: '°C' },
      fahrenheit: { name: 'Fahrenheit', symbol: '°F' },
      kelvin: { name: 'Kelvin', symbol: 'K' },
    },
    convert: (value, from, to) => {
      let c
      if (from === 'fahrenheit') c = (value - 32) * 5 / 9
      else if (from === 'kelvin') c = value - 273.15
      else c = value

      if (to === 'fahrenheit') return c * 9 / 5 + 32
      if (to === 'kelvin') return c + 273.15
      return c
    },
  },
  time: {
    name: 'Time',
    icon: Clock,
    baseUnit: 'second',
    units: {
      second: { name: 'Second', symbol: 's', toBase: 1 },
      minute: { name: 'Minute', symbol: 'min', toBase: 60 },
      hour: { name: 'Hour', symbol: 'h', toBase: 3600 },
      day: { name: 'Day', symbol: 'd', toBase: 86400 },
    },
  },
  volume: {
    name: 'Volume',
    icon: Droplets,
    baseUnit: 'liter',
    units: {
      liter: { name: 'Liter', symbol: 'L', toBase: 1 },
      milliliter: { name: 'Milliliter', symbol: 'mL', toBase: 0.001 },
      gallon: { name: 'Gallon', symbol: 'gal', toBase: 3.78541 },
    },
  },
}

const TABS = [
  { id: 'base', name: 'Base', icon: Binary },
  { id: 'temperature', name: 'Temp', icon: Thermometer },
  { id: 'length', name: 'Length', icon: Ruler },
  { id: 'mass', name: 'Mass', icon: Scale },
  { id: 'volume', name: 'Volume', icon: Droplets },
  { id: 'time', name: 'Time', icon: Clock },
]

/* =========================
   MAIN CONTAINER
========================= */

function UnitConverter({ initialValue = '', onClose }) {
  const [activeTab, setActiveTab] = useState('base')

  return (
    <div className="fixed inset-0 z-50 bg-dark-900/95 backdrop-blur">
      <div className="h-full flex flex-col max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center h-14 justify-between p-4 border-b border-dark-700">
          <h2 className="text-lg font-semibold text-white">Unit Converter</h2>
          <button onClick={onClose} className="p-2 bg-dark-700 rounded">
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-dark-700 overflow-x-auto">
          {TABS.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 flex items-center gap-2 ${
                  activeTab === tab.id ? 'text-primary-400' : 'text-dark-400'
                }`}
              >
                <Icon size={16} />
                {tab.name}
              </button>
            )
          })}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'base' ? (
            <BaseConverter initialValue={initialValue} />
          ) : (
            <UnitConverterPanel
              config={CONVERSIONS[activeTab]}
              initialValue={initialValue}
            />
          )}
        </div>
      </div>
    </div>
  )
}

/* =========================
   BASE CONVERTER
========================= */

function BaseConverter({ initialValue }) {
  const [decimal, setDecimal] = useState('')
  const [binary, setBinary] = useState('')
  const [octal, setOctal] = useState('')
  const [hex, setHex] = useState('')

  useEffect(() => {
    const n = parseInt(initialValue)
    if (!isNaN(n)) {
      setDecimal(n.toString())
      setBinary(n.toString(2))
      setOctal(n.toString(8))
      setHex(n.toString(16).toUpperCase())
    }
  }, [initialValue])

  return (
    <div className="p-4 space-y-3">
      <input value={decimal} readOnly className="w-full p-2 bg-dark-800" />
      <input value={binary} readOnly className="w-full p-2 bg-dark-800" />
      <input value={octal} readOnly className="w-full p-2 bg-dark-800" />
      <input value={hex} readOnly className="w-full p-2 bg-dark-800" />
    </div>
  )
}

/* =========================
   UNIT CONVERTER PANEL
========================= */

function UnitConverterPanel({ config, initialValue }) {
  const [inputValue, setInputValue] = useState('')
  const [fromUnit, setFromUnit] = useState(
    Object.keys(config.units)[0]
  )
  const [search, setSearch] = useState('')

  /* 🔥 IMPORTANT FIX */
  useEffect(() => {
    const first = Object.keys(config.units)[0]
    setFromUnit(first)
    setInputValue('')
  }, [config])

  useEffect(() => {
    if (!isNaN(parseFloat(initialValue))) {
      setInputValue(initialValue)
    }
  }, [initialValue])

  const convertValue = useCallback(
    (value, from, to) => {
      if (!value || isNaN(parseFloat(value))) return ''

      const num = parseFloat(value)

      if (config.convert) {
        return config.convert(num, from, to)
      }

      const fromCfg = config.units[from]
      const toCfg = config.units[to]

      if (!fromCfg || !toCfg) return ''

      return (num * fromCfg.toBase) / toCfg.toBase
    },
    [config]
  )

  const filteredUnits = useMemo(() => {
    if (!search) return Object.entries(config.units)
    return Object.entries(config.units).filter(([u]) =>
      u.name.toLowerCase().includes(search.toLowerCase())
    )
  }, [search, config.units])

  return (
    <div className="p-4 space-y-4">
      <input
        type="number"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="w-full p-3 bg-dark-800"
      />

      <select
        value={fromUnit}
        onChange={(e) => setFromUnit(e.target.value)}
        className="w-full p-2 bg-dark-800"
      >
        {Object.entries(config.units).map(([k, u]) => (
          <option key={k} value={k}>
            {u.symbol}
          </option>
        ))}
      </select>

      <input
        placeholder="Search units..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-2 bg-dark-800"
      />

      <div className="space-y-2">
        {filteredUnits.map(([key, unit]) => {
          const val = convertValue(inputValue, fromUnit, key)
          return (
            <div
              key={key}
              className="flex justify-between bg-dark-800 p-3 rounded"
            >
              <span>{unit.name}</span>
              <span>{val !== '' ? val : '-'}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default UnitConverter
