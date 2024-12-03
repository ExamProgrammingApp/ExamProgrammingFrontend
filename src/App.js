import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import Exams from "./pages/Exams";
import SideNavbar from "./components/SideNavbar";
import TopNavbar from "./components/TopNavbar";
import Content from "./components/Content";
import ProgramExam from "./pages/ProgramExam";
import ConfirmExam from "./pages/ConfirmExam";
import EditExams from "./pages/EditExams";
import PageNotFound from "./pages/PageNotFound";
import PrivateRoute from "./components/PrivateRoute";
import AllExams from "./pages/AllExams";
import Auth from "./auth/Auth";
import { AuthProvider } from "./auth/AuthContext";
import { useState } from "react";

function App() {
  const [userType, setUserType] = useState(() => {
    return localStorage.getItem("userType") || null; // Valoare implicită "user"
  });

  const handleUserChange = (user = "user") => {
    setUserType(user);
    console.log(user);
    localStorage.setItem("userType", user); // Salvează userType în localStorage
  };

  return (
    <AuthProvider>
      <Router>
        <div className="flex min-h-screen">
          <SideNavbar userType={userType} />
          <div className="flex flex-col w-full">
            <TopNavbar userType={userType} />
            <Content>
              <div>
                <Routes>
                  {/* PAGES FOR ALL USERS */}
                  <Route
                    path="/*"
                    element={
                      <PrivateRoute
                        element={
                          <PageNotFound
                            resetUser={(userType) => handleUserChange(userType)}
                          />
                        }
                      />
                    }
                  />
                  {/* PAGES FOR UNREGISTERED USERS */}
                  {userType === "user" && (
                    <Route
                      path="/all_exams"
                      element={<PrivateRoute element={<AllExams />} />}
                    />
                  )}

                  {/* PAGES ONLY FOR STUDENTS AND TEACHERS */}
                  {(userType === "student" || userType === "headstudent" || userType === "teacher") && (
                    <Route
                      path="/exams"
                      element={<PrivateRoute element={<Exams />} />}
                    />
                  )}

                  {/* PAGES ONLY FOR HEADSTUDENTS */}
                  {userType === "headstudent" && (
                    <Route
                      path="/program_exam"
                      element={<PrivateRoute element={<ProgramExam />} />}
                    />
                  )}
                  {userType === "headstudent" && (
                    <Route
                      path="/modify_exam"
                      element={<PrivateRoute element={<EditExams />} />}
                    />
                  )}

                  {/* PAGES ONLY FOR TEACHERS */}
                  {userType === "teacher" && (
                    <Route
                      path="/confirm_exam"
                      element={<PrivateRoute element={<ConfirmExam />} />}
                    />
                  )}
                  
                  {/* UNPROTECTED PAGES */}
                  <Route
                    path="/auth"
                    element={
                      <Auth
                        onLogin={(userType) => handleUserChange(userType)}
                      />
                    }
                  />
                </Routes>
              </div>
            </Content>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
