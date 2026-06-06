import { useEffect, useState } from "react";
import { CalendarDays, Dumbbell, ShieldCheck } from "lucide-react";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";
import { memberSelfApi } from "../../api/endpoints.js";
import { formatCurrency, formatDate } from "../../utils/formatters.js";

const MemberMembership = () => {
  const [membership, setMembership] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    memberSelfApi
      .membership()
      .then(({ data }) => setMembership(data.data || null))
      .finally(() => setLoading(false));
  }, []);

  const plan = membership?.planId;

  if (loading) {
    return (
      <div className="screen-loader compact">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="page member-page">
      <div className="page-header">
        <div>
          <span className="eyebrow">Membership</span>
          <h1>Current Membership</h1>
          <p>Your assigned plan and membership timeline.</p>
        </div>
      </div>

      <section className="member-info-grid">
        <article className="member-info-card accent-card">
          <Dumbbell size={24} />
          <span>Current Plan</span>
          <strong>{plan?.name || "No active plan"}</strong>
          <p>{plan ? `${formatCurrency(plan.price)} for ${plan.durationInDays} days` : ""}</p>
        </article>
        <article className="member-info-card">
          <CalendarDays size={24} />
          <span>Start Date</span>
          <strong>{formatDate(membership?.startDate)}</strong>
        </article>
        <article className="member-info-card">
          <CalendarDays size={24} />
          <span>End Date</span>
          <strong>{formatDate(membership?.endDate)}</strong>
        </article>
        <article className="member-info-card">
          <ShieldCheck size={24} />
          <span>Status</span>
          <strong className={`status-badge ${membership?.status || "expired"}`}>
            {membership?.status || "Inactive"}
          </strong>
        </article>
      </section>
    </div>
  );
};

export default MemberMembership;
