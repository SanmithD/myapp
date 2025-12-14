import { Route, Routes } from 'react-router-dom'
import CalculatorApp from './components/Calculator/CalculatorApp'
import DrawPad from './components/Draw/DrawPad'
import Home from './components/Home'
import Layout from './components/Layout'
import NotesApp from './components/Notes/NotesApp'
import PasswordHome from './components/PasswordManager/PasswordHome'
import VoiceApp from './components/Voice/VoiceApp'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/notes" element={<NotesApp />} />
        <Route path="/calculator" element={<CalculatorApp />} />
        <Route path="/voice" element={<VoiceApp />} />
        <Route path="/draw" element={<DrawPad />} />
        <Route path="/password" element={<PasswordHome />} />
      </Routes>
    </Layout>
  )
}

export default App