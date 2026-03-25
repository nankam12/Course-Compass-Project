import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner container">
        {/* Brand */}
        <Link to="/" className="navbar-brand" onClick={() => setMenuOpen(false)}>
          <span className="navbar-logo">📚</span>
          <span className="navbar-name">Course Resource Hub</span>
        </Link>

        {/* Hamburger toggle (mobile) */}
        <button
          className={`navbar-toggle ${menuOpen ? 'navbar-toggle--open' : ''}`}
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>

        {/* Nav links */}
        <div className={`navbar-menu ${menuOpen ? 'navbar-menu--open' : ''}`}>
          <NavLink
            to="/courses"
            className={({ isActive }) => `navbar-link ${isActive ? 'navbar-link--active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            Browse Courses
          </NavLink>

          {user ? (
            <div className="navbar-user">
              <span className="navbar-username">👤 {user.username}</span>
              <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
                Sign Out
              </button>
            </div>
          ) : (
            <div className="navbar-auth">
              <NavLink
                to="/login"
                className={({ isActive }) => `navbar-link ${isActive ? 'navbar-link--active' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                Sign In
              </NavLink>
              <Link
                to="/register"
                className="btn btn-accent btn-sm"
                onClick={() => setMenuOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
