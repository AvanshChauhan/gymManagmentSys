import { useEffect, useState } from "react";
import {
  Activity,
  CreditCard,
  Dumbbell,
  Flame,
  ShieldCheck,
  Users,
} from "lucide-react";
import { dashboardApi, paymentsApi } from "../api/endpoints.js";
import DashboardCard from "../components/common/DashboardCard.jsx";
import DataTable from "../components/common/DataTable.jsx";
import { formatCurrency, formatDate, getMemberName } from "../utils/formatters.js";

const REFRESH_INTERVAL_MS = 15000;

const getChartBars = (dailyRevenue = []) => {
  const recentDays = dailyRevenue.slice(-7);
  const maxRevenue = Math.max(...recentDays.map((item) => item.totalRevenue || 0), 0);

  return recentDays.map((item) => ({
    ...item,
    height: maxRevenue ? Math.max((item.totalRevenue / maxRevenue) * 100, 10) : 0,
  }));
};

const Dashboard = () => {
  const [stats, setStats] = useState({});
  const [revenue, setRevenue] = useState({});
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchDashboard = () => {
      Promise.all([
        dashboardApi.stats(),
        dashboardApi.revenue(),
        paymentsApi.list({ page: 1, limit: 5 }),
      ])
        .then(([statsRes, revenueRes, paymentsRes]) => {
          if (!mounted) return;
          setStats(statsRes.data.data || {});
          setRevenue(revenueRes.data.data || {});
          setPayments(paymentsRes.data.data || []);
          setLastUpdated(new Date());
        })
        .finally(() => mounted && setLoading(false));
    };

    fetchDashboard();
    const intervalId = window.setInterval(fetchDashboard, REFRESH_INTERVAL_MS);

    return () => {
      mounted = false;
      window.clearInterval(intervalId);
    };
  }, []);

  const chartBars = getChartBars(revenue.dailyRevenue);

  const columns = [
    { key: "member", label: "Member", render: getMemberName },
    {
      key: "amount",
      label: "Amount",
      render: (row) => formatCurrency(row.amount),
    },
    { key: "method", label: "Method", render: (row) => row.paymentMethod },
    { key: "date", label: "Date", render: (row) => formatDate(row.paymentDate) },
  ];

  return (
    <div className="page dashboard-page">
      <div className="page-header">
        <div>
          <span className="eyebrow">Organization View</span>
          <h1>Organization Dashboard</h1>
          <p>Welcome to the FitSuite Admin Dashboard</p>
        </div>
      </div>

      <section className="stats-grid">
        <DashboardCard title="Total Members" value={stats.totalMembers || 0} icon={Users} />
        <DashboardCard title="Total Plans" value={stats.totalPlans || 0} icon={Dumbbell} />
        <DashboardCard
          title="Active Memberships"
          value={stats.activeMemberships || 0}
          icon={ShieldCheck}
        />
        <DashboardCard
          title="Expired Memberships"
          value={stats.expiredMemberships || 0}
          icon={Flame}
          positive={false}
        />
        <DashboardCard
          title="Total Payments"
          value={stats.totalPayments || 0}
          icon={CreditCard}
        />
      </section>

      <section className="dashboard-grid">
        <article className="chart-card">
          <div className="section-title">
            <div>
              <h2>Revenue Pulse</h2>
              <p>
                {formatCurrency(revenue.totalRevenue)} collected
                {lastUpdated ? ` - live ${lastUpdated.toLocaleTimeString("en-IN")}` : ""}
              </p>
            </div>
            <Activity size={20} />
          </div>
          {chartBars.length ? (
            <div className="revenue-chart">
              {chartBars.map((item) => (
                <div className="revenue-chart__bar" key={item.date}>
                  <strong>{formatCurrency(item.totalRevenue)}</strong>
                  <span style={{ height: `${item.height}%` }} />
                  <small>{formatDate(item.date).replace(" 20", " ")}</small>
                </div>
              ))}
            </div>
          ) : (
            <div className="chart-empty">No revenue collected yet</div>
          )}
        </article>
        <article>
          <div className="section-title">
            <div>
              <h2>Recent Payments</h2>
              <p>Latest successful collections</p>
            </div>
          </div>
          <DataTable columns={columns} data={payments} loading={loading} />
        </article>
      </section>
    </div>
  );
};

export default Dashboard;
