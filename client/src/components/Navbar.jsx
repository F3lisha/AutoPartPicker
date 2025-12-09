// src/components/Navbar.jsx
import { Link, NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="logo">
          AutoPart<span>Picker</span>
        </div>
        <ul className="nav-links">
          <li>
            <NavLink to="/" end>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/listings">Listings</NavLink>
          </li>
          <li>
            <NavLink to="/messages">Messages</NavLink>
          </li>
          <li>
            <NavLink to="/reviews">Reviews</NavLink>
          </li>
          <li>
            <NavLink to="/reports">Reports</NavLink>
          </li>
          <li>
            <NavLink to="/profile">Profile</NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
