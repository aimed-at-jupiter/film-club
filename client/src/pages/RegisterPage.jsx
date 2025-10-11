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
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <h2 className="mb-4 text-center">Register</h2>
      <RegisterForm onSubmit={registerUser} loading={loading} />
      {authError && (
        <div className="alert alert-danger mt-3 text-center">{authError}</div>
      )}
    </div>
  );
}

export default RegisterPage;
