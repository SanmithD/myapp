import { Route, Routes } from 'react-router-dom'
import CalculatorApp from './components/Calculator/CalculatorApp'
import Home from './components/Home'
import Layout from './components/Layout'
import NotesApp from './components/Notes/NotesApp'
import VoiceApp from './components/Voice/VoiceApp'
import DrawPad from './components/Draw/DrawPad'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/notes" element={<NotesApp />} />
        <Route path="/calculator" element={<CalculatorApp />} />
        <Route path="/voice" element={<VoiceApp />} />
        <Route path="/draw" element={<DrawPad />} />
      </Routes>
    </Layout>
  )
}

export default App