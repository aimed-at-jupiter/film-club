import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm";

function LoginPage() {
  const { loginUser, authError, user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  return (
    <main className="container mt-5" role="main">
      <div className="rowcol-12 d-flex justify-content-center">
        <div className="login-form-wrapper">
          <h2 className="text-center mb-4" tabIndex="-1" aria-live="polite">
            Log in
          </h2>
          <LoginForm onSubmit={loginUser} loading={loading} />
          {authError && (
            <div
              className="alert alert-danger mt-3 text-center"
              role="alert"
              aria-live="assertive"
            >
              {authError}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default LoginPage;
