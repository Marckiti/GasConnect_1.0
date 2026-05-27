import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import AOS from "aos";             
import "aos/dist/aos.css";        

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Crud from "./components/crud/Crud";
import Create from "./components/crud/Create";
import Read from "./components/crud/Read";
import { AuthProvider } from "./AuthContext";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  useEffect(() => {
    AOS.init({
      duration: 1000, 
      once: false,    
      mirror: true, 
    });
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route index element={<Landing />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="dashboard" element={<Dashboard />} />
        <Route path="crud" element={<ProtectedRoute><Crud /></ProtectedRoute>} />
        <Route path="create" element={<ProtectedRoute><Create /></ProtectedRoute>} />        <Route path="read" element={<ProtectedRoute><Read /></ProtectedRoute>} />          <Route path='*' element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
