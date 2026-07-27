import { Routes, Route } from "react-router-dom";
import CreateBook from "../pages/CreateBook";
import Reader from "../pages/Reader";
import Editor from "../pages/Editor";
import Settings from "../pages/Settings";
import BookHome from "../pages/Home";
import "./theme.css";

export default function MyBook() {
  return (
    <Routes>
      <Route index element={<BookHome />} />
      <Route path="create" element={<CreateBook />} />
      <Route path="reader/:id" element={<Reader />} />
      <Route path="editor/:id" element={<Editor />} />
      <Route path="settings" element={<Settings />} />
    </Routes>
  );
}