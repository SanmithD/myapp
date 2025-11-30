import { Route, Routes } from 'react-router-dom'
import CalculatorApp from './components/Calculator/CalculatorApp'
import Home from './components/Home'
import Layout from './components/Layout'
import NotesApp from './components/Notes/NotesApp'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/notes" element={<NotesApp />} />
        <Route path="/calculator" element={<CalculatorApp />} />
      </Routes>
    </Layout>
  )
}

export default App