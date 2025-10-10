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
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <h2 className="mb-4 text-center">Log In</h2>
      <LoginForm onSubmit={loginUser} loading={loading} />
      {authError && (
        <div className="alert alert-danger mt-3 text-center">{authError}</div>
      )}
    </div>
  );
}

export default LoginPage;
