import { useState } from "react";
import { Activity, ArrowRight, Lock, Mail } from "lucide-react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/common/LoadingSpinner.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import logo from "../assets/logo.png";

const getRoleHome = (role) => (role === "member" ? "/member/dashboard" : "/dashboard");

const Login = () => {
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (isAuthenticated) {
    return <Navigate to={getRoleHome(user?.role)} replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const currentUser = await login(form);
      const fallbackPath = getRoleHome(currentUser?.role);
      navigate(location.state?.from?.pathname || fallbackPath, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Unable to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-panel">
        <div className="login-panel__visual">
          <div className="brand-mark">
            <img src={logo} alt="FitSuite Logo" />
          </div>
          <h1>FitSuite</h1>
          <p>Premium access for gym teams and members.</p>
          <div className="metric-strip">
            <span>Members</span>
            <strong>24/7</strong>
            <span>Access</span>
          </div>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <span className="eyebrow">Secure Login</span>
          <h2>Welcome back</h2>
          <label>
            <Mail size={18} />
            <input
              placeholder="Email or phone"
              value={form.email}
              onChange={(event) =>
                setForm((current) => ({ ...current, email: event.target.value }))
              }
            />
          </label>
          <label>
            <Lock size={18} />
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(event) =>
                setForm((current) => ({ ...current, password: event.target.value }))
              }
            />
          </label>
          {error && <div className="form-error">{error}</div>}
          <button className="primary-button" disabled={loading}>
            {loading ? <LoadingSpinner /> : "Login"}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>
      </section>
    </main>
  );
};

export default Login;
