import { evaluate, format } from 'mathjs'

export const calculateExpression = (expression, angleMode = 'deg') => {
  try {
    let processedExp = expression
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/π/g, 'pi')
      .replace(/φ/g, 'phi')
      .replace(/√/g, 'sqrt')
      .replace(/∛/g, 'cbrt')
      .replace(/\^/g, '^')
      .replace(/%/g, '/100')

    // Handle angle mode for trig functions
    if (angleMode === 'deg') {
      // Convert degrees to radians for trig functions
      processedExp = processedExp
        .replace(/sin\(([^)]+)\)/g, 'sin(($1) * pi / 180)')
        .replace(/cos\(([^)]+)\)/g, 'cos(($1) * pi / 180)')
        .replace(/tan\(([^)]+)\)/g, 'tan(($1) * pi / 180)')
        // Inverse trig returns degrees
        .replace(/asin\(([^)]+)\)/g, '(asin($1) * 180 / pi)')
        .replace(/acos\(([^)]+)\)/g, '(acos($1) * 180 / pi)')
        .replace(/atan\(([^)]+)\)/g, '(atan($1) * 180 / pi)')
    }

    // Handle factorial
    processedExp = processedExp.replace(/(\d+)!/g, 'factorial($1)')

    const result = evaluate(processedExp)
    
    if (typeof result === 'number') {
      if (!isFinite(result)) {
        throw new Error('Result is infinite')
      }
      if (Number.isInteger(result)) {
        return result.toString()
      }
      return format(result, { precision: 10 })
    }
    
    return result.toString()
  } catch (error) {
    console.log(error);
    throw new Error('Invalid expression')
  }
}

// Try to calculate without throwing (for preview)
export const tryCalculate = (expression, angleMode = 'deg') => {
  try {
    return calculateExpression(expression, angleMode)
  } catch {
    return null
  }
}

export const formatNumber = (num) => {
  if (typeof num === 'string') {
    num = parseFloat(num)
  }
  if (isNaN(num)) return '0'
  
  return num.toLocaleString('en-US', {
    maximumFractionDigits: 10
  })
}