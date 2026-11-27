import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar">
      <span className="brand">Plant Disease Detection</span>
      <NavLink to="/dashboard">Dashboard</NavLink>
      <NavLink to="/" end>Detect</NavLink>
      <NavLink to="/history">History</NavLink>
      <NavLink to="/statistics">Statistics</NavLink>
      <NavLink to="/about">About</NavLink>
    </nav>
  );
}