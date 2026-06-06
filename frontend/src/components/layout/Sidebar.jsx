import {
  Activity,
  CreditCard,
  Dumbbell,
  Gauge,
  LogOut,
  Settings,
  ShieldCheck,
  Users,
  WalletCards,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import logo from "../../assets/logo.png";

const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: Gauge },
  { label: "Members", path: "/members", icon: Users },
  { label: "Plans", path: "/plans", icon: Dumbbell },
  { label: "Memberships", path: "/memberships", icon: ShieldCheck },
  { label: "Payments", path: "/payments", icon: CreditCard },
  { label: "Settings", path: "/settings", icon: Settings },
];

const Sidebar = ({ collapsed }) => {
  const { logout, user } = useAuth();

  return (
    <aside className={`sidebar ${collapsed ? "is-collapsed" : ""}`}>
      <div className="sidebar__brand">
        <div className="sidebar__logo">
          <img src={logo} alt="FitSuite Logo" />
        </div>
        <div>
          <strong>FitSuite</strong>
          <span>Gym Admin</span>
        </div>
      </div>

      <nav className="sidebar__nav">
        <span className="sidebar__section">Overview</span>
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink key={item.path} to={item.path} className="sidebar__link">
              <Icon size={19} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar__footer">
        <div className="sidebar__user">
          <div className="avatar">{user?.name?.charAt(0) || "A"}</div>
          <div>
            <strong>{user?.name || "Admin"}</strong>
            <span>{user?.email || user?.phone || "Gym owner"}</span>
          </div>
        </div>
        <button className="sidebar__logout" onClick={logout}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
