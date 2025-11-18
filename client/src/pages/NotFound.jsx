import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="container text-center mt-5">
      <h1 className="display-4">404</h1>
      <p className="lead">The page you're looking for does not exist.</p>

      <Link to="/" className="btn btn-primary mt-3">
        Go Home
      </Link>
    </div>
  );
}
