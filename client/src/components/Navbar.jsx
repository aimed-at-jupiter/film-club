import { useAuth } from "../context/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { useEventFilter } from "../context/EventFilterContext";

function Navbar() {
  const { user, logoutUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const { filter, setFilter } = useEventFilter();
  const navigate = useNavigate();
  const location = useLocation();

  const handleFilterClick = (filterType) => {
    setFilter(filterType);
    if (location.pathname === "/") {
      window.dispatchEvent(
        new CustomEvent("setFilter", { detail: filterType })
      );
    } else {
      navigate(`/?filter=${filterType}`);
    }
    setIsOpen(false);
  };

  const toggle = () => setIsOpen(!isOpen);
  const closeNavbar = () => setIsOpen(false);

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
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <button
                className={`btn btn-link nav-link ${
                  filter === "all" ? "fw-bold" : ""
                }`}
                onClick={() => handleFilterClick("all")}
              >
                All Events
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`btn btn-link nav-link ${
                  filter === "screening" ? "fw-bold" : ""
                }`}
                onClick={() => handleFilterClick("screening")}
              >
                Screenings
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`btn btn-link nav-link ${
                  filter === "discussion" ? "fw-bold" : ""
                }`}
                onClick={() => handleFilterClick("discussion")}
              >
                Discussions
              </button>
            </li>

            {user && user.role === "staff" && (
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/create-event"
                  onClick={closeNavbar}
                >
                  Create Event
                </Link>
              </li>
            )}
          </ul>

          <ul className="navbar-nav ms-auto">
            {user ? (
              <>
                <span className="navbar-text me-2"> {user.username} </span>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/my-events"
                    onClick={closeNavbar}
                  >
                    My Events
                  </Link>
                </li>
                <li className="nav-item">
                  <button
                    className="btn btn-light"
                    onClick={() => {
                      logoutUser();
                      closeNavbar();
                    }}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login" onClick={closeNavbar}>
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/register"
                    onClick={closeNavbar}
                  >
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
