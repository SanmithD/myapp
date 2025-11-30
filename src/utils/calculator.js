import { evaluate, format } from 'mathjs'

export const calculateExpression = (expression) => {
  try {
    // Replace display symbols with math.js compatible ones
    let processedExp = expression
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/π/g, 'pi')
      .replace(/√/g, 'sqrt')
      .replace(/\^/g, '^')
      .replace(/%/g, '/100')

    const result = evaluate(processedExp)
    
    // Format result
    if (typeof result === 'number') {
      if (Number.isInteger(result)) {
        return result.toString()
      }
      // Round to 10 decimal places to avoid floating point issues
      return format(result, { precision: 10 })
    }
    
    return result.toString()
  } catch (error) {
    console.log(error);
    throw new Error('Invalid expression')
  }
}

export const formatNumber = (num) => {
  if (typeof num === 'string') {
    num = parseFloat(num)
  }
  if (isNaN(num)) return '0'
  
  // Format with thousand separators
  return num.toLocaleString('en-US', {
    maximumFractionDigits: 10
  })
}