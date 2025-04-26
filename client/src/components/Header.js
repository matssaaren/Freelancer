import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css';

function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="header">
      <nav className="nav">
        <Link to="/">Home</Link>
        <Link to="/jobs">Jobs</Link>

        {user && <Link to="/profile">Profile</Link>}

        <div style={{ marginLeft: 'auto', display: 'flex', gap: '15px', alignItems: 'center' }}>
          {user ? (
            <>
              <span style={{ color: 'white', fontWeight: 'bold' }}>Logged in as: {user.name}</span>
              <button
                onClick={logout}
                style={{
                  background: 'white',
                  color: '#007bff',
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;
