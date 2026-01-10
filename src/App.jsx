import { Route, Routes } from "react-router-dom";
import CalculatorApp from "./components/Calculator/CalculatorApp";
import DrawPad from "./components/Draw/DrawPad";
import Home from "./components/Home";
import Layout from "./components/Layout";
import NotesApp from "./components/Notes/NotesApp";
import PasswordHome from "./components/PasswordManager/PasswordHome";
import StockDetails from "./components/StockMonitor/pages/StockDetails";
import StockList from "./components/StockMonitor/pages/StockList";
import VoiceApp from "./components/Voice/VoiceApp";
import { FocusTimer } from "./components/Focus/FocusTimer";

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
        <Route path="/trade" element={<StockList />} />
        <Route path="/stock/:id" element={<StockDetails />} />
        <Route path="/focus" element={<FocusTimer />} />
      </Routes>
    </Layout>
  );
}

export default App;
