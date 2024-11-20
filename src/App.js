import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Exams from "./Exams";
import SideNavbar from "./components/SideNavbar";
import TopNavbar from "./components/TopNavbar";
import Content from "./components/Content";
import ProgramExam from "./ProgramExam";
import Home from "./Home";
import Auth from "./Auth";
import ConfirmExam from "./ConfirmExam";
import EditExams from "./EditExams";
import PageNotFound from "./PageNotFound";

function App() {
  return (
    <Router>
      <div className="flex min-h-screen">
        <SideNavbar />
        <div className="flex flex-col w-full">
          <TopNavbar />
          <Content>
            <div>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/exams" element={<Exams />} />
                <Route path="/program_exam" element={<ProgramExam />} />
                <Route path="/modify_exam" element={<EditExams />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/confirm_exam" element={<ConfirmExam />} />
                <Route path="*" element={<PageNotFound />} />
              </Routes>
            </div>
          </Content>
        </div>
      </div>
    </Router>
  );
}

export default App;
