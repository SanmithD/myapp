import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import MyBook from "./components/ancient-book-writer/src/App";
import Layout from "./components/Layout";
import TasksDashboard from "./components/TaskManager/pages/TasksDashboard";
import TasksHome from "./components/TaskManager/pages/TasksHome";

// Lazy imports
const Home = lazy(() => import("./components/Home"));
const NotesApp = lazy(() => import("./components/Notes/NotesApp"));
const CalculatorApp = lazy(() => import("./components/Calculator/CalculatorApp"));
const VoiceApp = lazy(() => import("./components/Voice/VoiceApp"));
const DrawPad = lazy(() => import("./components/Draw/DrawPad"));
const PasswordHome = lazy(() => import("./components/PasswordManager/PasswordHome"));
const FocusTimer = lazy(() => import("./components/Focus/FocusTimer"));

function App() {
  return (
    <Layout>
      <Suspense fallback={<div style={{ padding: 20 }}>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/notes" element={<NotesApp />} />
          <Route path="/calculator" element={<CalculatorApp />} />
          <Route path="/voice" element={<VoiceApp />} />
          <Route path="/draw" element={<DrawPad />} />
          <Route path="/password" element={<PasswordHome />} />
          <Route path="/focus_timer" element={<FocusTimer />} />
          <Route path="/book_home/*" element={<MyBook />} />
          <Route path="/tasks" element={<TasksHome />} />
          <Route path="/tasks/dashboard" element={<TasksDashboard />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}

export default App;