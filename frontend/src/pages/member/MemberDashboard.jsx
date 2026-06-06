import { useEffect, useState } from "react";
import { CalendarClock, CreditCard, Dumbbell, ShieldCheck } from "lucide-react";
import DashboardCard from "../../components/common/DashboardCard.jsx";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";
import { memberSelfApi } from "../../api/endpoints.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { formatCurrency, formatDate } from "../../utils/formatters.js";

const MemberDashboard = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    memberSelfApi
      .summary()
      .then(({ data }) => setSummary(data.data || {}))
      .finally(() => setLoading(false));
  }, []);

  const membership = summary.membership;
  const plan = summary.plan;

  if (loading) {
    return (
      <div className="screen-loader compact">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="page member-page">
      <div className="member-welcome accent-card">
        <div>
          <span className="eyebrow">Member Dashboard</span>
          <h1>Welcome, {user?.name || "Member"}</h1>
          <p>Your plan, dues, and membership status in one place.</p>
        </div>
        <div className="member-welcome__photo">
          {user?.profileImage ? (
            <img src={user.profileImage} alt={user?.name || "Member"} />
          ) : (
            user?.name?.charAt(0) || "M"
          )}
        </div>
      </div>

      <section className="stats-grid member-stats">
        <DashboardCard
          title="Active Plan"
          value={plan?.name || "No plan"}
          icon={Dumbbell}
        />
        <DashboardCard
          title="Membership Status"
          value={membership?.status || "Inactive"}
          icon={ShieldCheck}
        />
        <DashboardCard
          title="Membership Expiry"
          value={formatDate(membership?.endDate)}
          icon={CalendarClock}
        />
        <DashboardCard
          title="Pending Amount"
          value={formatCurrency(summary.pendingAmount)}
          icon={CreditCard}
          positive={(summary.pendingAmount || 0) === 0}
        />
      </section>
    </div>
  );
};

export default MemberDashboard;
