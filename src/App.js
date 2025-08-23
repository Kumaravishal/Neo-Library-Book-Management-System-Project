import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import RegisterPage from "./components/Register";
import LoginPage from "./components/LoginPage";
import Home from "./components/Home";
import AddBook from "./components/AddBook";
import ViewBooks from "./components/ViewBooks";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./App.css";

function App() {
  // Check if user is authenticated
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  return (
    <Router>
      <div className="app-container">
        {isAuthenticated && <Navbar />}

        <main className="main-content">
          <Routes>
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/home" element={<Home />} />
            
            <Route
              path="/home"
              element={isAuthenticated ? <Home /> : <Navigate to="/login" />}
            />
            <Route
              path="/addbook"
              element={isAuthenticated ? <AddBook /> : <Navigate to="/login" />}
            />
            <Route
              path="/viewbooks"
              element={isAuthenticated ? <ViewBooks /> : <Navigate to="/login" />}
            />

            <Route
              path="/"
              element={<Navigate to={isAuthenticated ? "/home" : "/login"} />}
            />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

        {isAuthenticated && <Footer />}
      </div>
    </Router>
  );
}

export default App;