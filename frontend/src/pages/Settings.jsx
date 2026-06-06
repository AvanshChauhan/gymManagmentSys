import { LogOut, Shield, UserRound } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const Settings = () => {
  const { user, logout } = useAuth();

  return (
    <div className="page settings-page">
      <div className="page-header">
        <div>
          <span className="eyebrow">Admin Console</span>
          <h1>Settings</h1>
          <p>Manage profile, access, and security preferences.</p>
        </div>
      </div>

      <section className="settings-grid">
        <article className="settings-card">
          <UserRound size={24} />
          <h2>Admin Profile</h2>
          <div className="detail-list">
            <span>Name</span>
            <strong>{user?.name || "Admin"}</strong>
            <span>Email</span>
            <strong>{user?.email || "Not set"}</strong>
            <span>Phone</span>
            <strong>{user?.phone || "Not set"}</strong>
          </div>
        </article>
        <article className="settings-card">
          <Shield size={24} />
          <h2>Change Password</h2>
          <form className="form-grid">
            <input type="password" placeholder="Current password" />
            <input type="password" placeholder="New password" />
            <button className="primary-button full" type="button">
              Update Password
            </button>
          </form>
        </article>
        <article className="settings-card accent-card">
          <LogOut size={24} />
          <h2>Logout</h2>
          <p>End the current admin session securely.</p>
          <button className="ghost-button danger" onClick={logout}>
            <LogOut size={18} />
            Logout
          </button>
        </article>
      </section>
    </div>
  );
};

export default Settings;
