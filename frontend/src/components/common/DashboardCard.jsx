import { TrendingDown, TrendingUp } from "lucide-react";

const DashboardCard = ({ title, value, icon: Icon, trend = "Live", positive = true }) => (
  <article className="dashboard-card">
    <div className="dashboard-card__top">
      <span>{title}</span>
      {Icon && <Icon size={20} />}
    </div>
    <strong>{value}</strong>
    <small className={positive ? "text-positive" : "text-danger"}>
      {positive ? <TrendingUp size={15} /> : <TrendingDown size={15} />}
      {trend}
    </small>
  </article>
);

export default DashboardCard;
