// hooks/useTheme.js
import { useEffect } from 'react'
import useLocalStorage from './useLocalStorage'

function useTheme() {
  const [theme, setTheme] = useLocalStorage('myapp-theme', 'dark')

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
      root.classList.remove('light')
    } else {
      root.classList.add('light')
      root.classList.remove('dark')
    }
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  return { theme, setTheme, toggleTheme }
}

export default useTheme