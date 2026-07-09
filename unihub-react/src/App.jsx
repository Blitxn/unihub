import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Homepage from "./Pages/Homepage";
import SearchPage from "./Pages/Searchpage";
import Comparepage from "./Pages/Comparepage";
import Careerpage from "./Pages/Careerpage";
import Adminpage from "./Pages/Adminpage";
import Scholarshipspage from "./Pages/Scholarshippage";
import Contactpage from "./Pages/Contactpage";
import LoginModal from "./components/LoginModal";
import "./home.css";

export default function App() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [pendingPath, setPendingPath] = useState(null);

  const openLogin = () => {
    setLoginOpen(true);
  };

  const requireLogin = (path) => {
    if (isLoggedIn) return true;
    setPendingPath(path);
    setLoginOpen(true);
    return false;
  };

  const closeLogin = () => {
    setLoginOpen(false);
    setPendingPath(null);
  };

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <Homepage
              onOpenLogin={openLogin}
              requireLogin={requireLogin}
              isLoggedIn={isLoggedIn}
            />
          }
        />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/compare" element={<Comparepage />} />
        <Route path="/career" element={<Careerpage />} />
        <Route path="/admin" element={<Adminpage />} />
        <Route path="/scholarships" element={<Scholarshipspage />} />
        <Route path="/contact" element={<Contactpage />} />
      </Routes>

      <LoginModal
        open={loginOpen}
        onClose={closeLogin}
        onLoginSuccess={() => setIsLoggedIn(true)}
        pendingPath={pendingPath}
      />
    </>
  );
}