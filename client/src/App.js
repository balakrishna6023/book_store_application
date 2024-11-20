import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AddBook from "./AddBook";
import EditBook from "./EditBook";
import Home from "./Home";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add-book" element={<AddBook />} />
        <Route path="/edit-book/:id" element={<EditBook />} />
      </Routes>
    </Router>
  );
}

export default App;
