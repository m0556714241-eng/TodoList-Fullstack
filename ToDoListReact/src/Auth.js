import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import service from './service.js';

// רכיב אחד לשני המצבים: התחברות והרשמה
function Auth({ mode }) {
  const isLogin = mode === "login";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (isLogin) {
        await service.login(username, password);
      } else {
        await service.register(username, password);
      }
      navigate("/");
    } catch {
      setError(isLogin ? "שם משתמש או סיסמה שגויים" : "שם המשתמש כבר קיים");
    }
  }

  return (
    <section className="todoapp">
      <header className="header">
        <h1>{isLogin ? "login" : "register"}</h1>
        <form onSubmit={handleSubmit}>
          <input className="new-todo" placeholder="Username"
                 value={username} onChange={(e) => setUsername(e.target.value)} />
          <input className="new-todo" type="password" placeholder="Password"
                 value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="submit" style={{ display: "none" }} />
        </form>
      </header>

      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

      <p style={{ textAlign: "center" }}>
        {isLogin
          ? <>אין לך חשבון? <Link to="/register">להרשמה</Link></>
          : <>יש לך חשבון? <Link to="/login">להתחברות</Link></>}
      </p>
    </section>
  );
}

export default Auth;
