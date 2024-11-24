import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Exams from "./pages/Exams";
import SideNavbar from "./components/SideNavbar";
import TopNavbar from "./components/TopNavbar";
import Content from "./components/Content";
import ProgramExam from "./pages/ProgramExam";
import Auth from "./auth/Auth";
import ConfirmExam from "./pages/ConfirmExam";
import EditExams from "./pages/EditExams";
import PageNotFound from "./pages/PageNotFound";

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
                <Route path="/" element={<Exams />} />
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
