// client/src/components/ErrorAlert.jsx
import PropTypes from "prop-types";

function ErrorAlert({ message, onRetry }) {
  if (!message) return null;

  return (
    <div
      className="alert alert-danger text-center mt-4"
      role="alert"
      aria-live="assertive"
    >
      <strong>Oops!</strong> {message}
      {onRetry && (
        <div className="mt-3">
          <button
            className="btn btn-outline-light btn-sm"
            onClick={onRetry}
            aria-label="Retry loading content"
          >
            Try again
          </button>
        </div>
      )}
    </div>
  );
}

ErrorAlert.propTypes = {
  message: PropTypes.string,
  onRetry: PropTypes.func,
};

export default ErrorAlert;
