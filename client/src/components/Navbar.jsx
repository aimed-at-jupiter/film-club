import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { useState } from "react";

function Navbar() {
  const { user, logoutUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <nav className="navbar sticky-top navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          Film Club
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          onClick={toggle}
          aria-controls="navbarNavAltMarkup"
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className={`collapse navbar-collapse${isOpen ? " show" : ""}`}
          id="navbarNavAltMarkup"
        >
          <ul className="navbar-nav">
            {user && user.role === "staff" && (
              <li className="nav-item">
                <Link className="nav-link" to="/create-event">
                  Create Event
                </Link>
              </li>
            )}

            {user ? (
              <>
                <span className="navbar-text"> {user.username} </span>

                <li className="nav-item">
                  <button className="btn btn-light" onClick={logoutUser}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
