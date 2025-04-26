import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';
import './Login.css';

function Login() {
  const { login } = useAuth();
  const location = useLocation();
  const registered = location.state?.registered || false;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {registered && <p style={{ color: 'green' }}>Account created successfully! Please log in.</p>}
      <form onSubmit={handleLogin} className="login-form">
        <label>Email</label>
        <input
          type="email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
