import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import RegisterForm from "../components/RegisterForm";

function RegisterPage() {
  const { registerUser, authError, user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  return (
    <main className="container mt-5" role="main">
      <h2 className="text-center mb-4" tabIndex="-1" aria-live="polite">
        Register
      </h2>
      <RegisterForm onSubmit={registerUser} loading={loading} />
      {authError && (
        <div
          className="alert alert-danger mt-3 text-center"
          role="alert"
          aria-live="assertive"
        >
          {authError}
        </div>
      )}
    </main>
  );
}

export default RegisterPage;
