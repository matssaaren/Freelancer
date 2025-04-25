import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <nav className="nav">
        <Link to="/">Home</Link>
        <Link to="/jobs">Jobs</Link>
        <Link to="/profile">Profile</Link>
      </nav>
    </header>
  );
}

export default Header;
