import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken || "");
    setIsLoading(false);
  }, []);

  const handleLogin = (newToken) => {
    console.log("Setting token:", newToken);
    setToken(newToken);
    localStorage.setItem("token", newToken);
  };

  const handleLogout = () => {
    console.log("Logging out");
    setToken("");
    localStorage.removeItem("token");
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={!token ? <Login onLogin={handleLogin} /> : <Navigate to="/" />}
        />
        <Route
          path="/"
          element={
            token ? (
              <ErrorBoundary>
                <Dashboard token={token} onLogout={handleLogout} />
              </ErrorBoundary>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;