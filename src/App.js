import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Exams from "./Exams";
import Nav from "./components/Nav";
import ProgramExam from "./ProgramExam";
import Home from "./Home";

function App() {
  return (
    <Router>
      <div className="flex flex-row">
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/exams" element={<Exams />} />
          <Route path="/program_exam" element={<ProgramExam />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
