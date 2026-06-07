import {
  Activity,
  CreditCard,
  Gauge,
  LogOut,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import logo from "../../assets/logo.png";

const navItems = [
  { label: "Dashboard", path: "/member/dashboard", icon: Gauge },
  { label: "Profile", path: "/member/profile", icon: UserRound },
  { label: "Membership", path: "/member/membership", icon: ShieldCheck },
  { label: "Payments", path: "/member/payments", icon: CreditCard },
];

const MemberSidebar = ({ collapsed, onClose }) => {
  const { logout, user } = useAuth();

  return (
    <aside className={`sidebar member-sidebar ${collapsed ? "is-collapsed" : ""}`}>
      <div className="sidebar__brand">
        <div className="sidebar__logo">
          <img src={logo} alt="FitSuite Logo" />
        </div>
        <div>
          <strong>FitSuite</strong>
          <span>Member Portal</span>
        </div>
      </div>

      <div className="member-sidebar__profile">
        <div className="member-sidebar__photo">
          {user?.profileImage ? (
            <img src={user.profileImage} alt={user?.name || "Member"} />
          ) : (
            user?.name?.charAt(0) || "M"
          )}
        </div>
        <strong>{user?.name || "Member"}</strong>
        <span>{user?.phone || user?.email || "Fitness member"}</span>
      </div>

      <nav className="sidebar__nav">
        <span className="sidebar__section">Member</span>
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink key={item.path} to={item.path} className="sidebar__link" onClick={onClose}>
              <Icon size={19} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar__footer">
        <button className="sidebar__logout" onClick={logout}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default MemberSidebar;
