import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Leaderboard from './Layouts/Leaderboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Kiểm tra trạng thái đăng nhập từ sessionStorage
    const loggedIn = sessionStorage.getItem("isAuthenticated");
    if (loggedIn === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <>
      <Routes>
        <Route 
          path="/" 
          element={isAuthenticated ? <Leaderboard /> : <Login setIsAuthenticated={setIsAuthenticated} />} 
        />
      </Routes>
    </>
  );
}

// 🔹 Component Login
const Login = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    if (email === "denQuanthanh@admin" && password === "qjW123denQuanthanh456789") {
      sessionStorage.setItem("isAuthenticated", "true"); // Lưu trạng thái vào sessionStorage
      setIsAuthenticated(true);
    } else {
      setError("Sai tài khoản hoặc mật khẩu!");
    }
  };

  return (
    <div className="login-container">
      <h2>Đăng Nhập Quản Trị</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleLogin}>
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
          autoComplete="off"
                            autoCorrect="off"
                            spellCheck="false"
        />
        <input 
          type="password" 
          placeholder="Mật khẩu" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
          autoComplete="off"
                            autoCorrect="off"
                            spellCheck="false"
        />
        <button type="submit">Đăng Nhập</button>
      </form>
    </div>
  );
};

export default App;
