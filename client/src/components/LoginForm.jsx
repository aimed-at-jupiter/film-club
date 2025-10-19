import { useState } from "react";

function LoginForm({ onSubmit, loading }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="email-input" className="form-label">
          Email address
        </label>
        <input
          type="email"
          className="form-control"
          id="email-input"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          disabled={loading}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="password-input" className="form-label">
          Password
        </label>
        <input
          type="password"
          className="form-control"
          id="password-input"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          disabled={loading}
        />
      </div>

      <button
        type="submit"
        className="btn btn-primary w-100"
        disabled={loading}
        aria-busy={loading}
      >
        {loading ? "Logging in..." : "Log In"}{" "}
      </button>
    </form>
  );
}

export default LoginForm;
