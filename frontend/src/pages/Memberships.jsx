import { useEffect, useState } from "react";
import { Plus, RefreshCw, XCircle } from "lucide-react";
import { membersApi, membershipsApi, plansApi } from "../api/endpoints.js";
import DataTable from "../components/common/DataTable.jsx";
import Modal from "../components/common/Modal.jsx";
import Pagination from "../components/common/Pagination.jsx";
import { formatDate } from "../utils/formatters.js";

const Memberships = () => {
  const [memberships, setMemberships] = useState([]);
  const [members, setMembers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ memberId: "", planId: "" });

  const loadMemberships = () => {
    setLoading(true);
    membershipsApi
      .list({ page, limit: 8 })
      .then(({ data }) => {
        setMemberships(data.data || []);
        setPagination(data.pagination);
      })
      .finally(() => setLoading(false));
  };

  useEffect(loadMemberships, [page]);

  useEffect(() => {
    Promise.all([
      membersApi.list({ page: 1, limit: 100 }),
      plansApi.list({ page: 1, limit: 100 }),
    ]).then(([membersRes, plansRes]) => {
      setMembers(membersRes.data.data || []);
      setPlans(plansRes.data.data || []);
    });
  }, []);

  const assignMembership = async (event) => {
    event.preventDefault();
    await membershipsApi.create(form);
    setModal(false);
    loadMemberships();
  };

  const renewMembership = async (membership) => {
    await membershipsApi.renew(membership._id);
    loadMemberships();
  };

  const cancelMembership = async (membership) => {
    if (!window.confirm("Cancel this membership?")) return;
    await membershipsApi.cancel(membership._id);
    loadMemberships();
  };

  const columns = [
    { key: "member", label: "Member Name", render: (row) => row.memberId?.name || "Unknown" },
    { key: "plan", label: "Plan Name", render: (row) => row.planId?.name || "Unknown" },
    { key: "startDate", label: "Start Date", render: (row) => formatDate(row.startDate) },
    { key: "endDate", label: "End Date", render: (row) => formatDate(row.endDate) },
    {
      key: "status",
      label: "Status",
      render: (row) => <span className={`status-badge ${row.status}`}>{row.status}</span>,
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="row-actions">
          <button className="ghost-button" onClick={() => renewMembership(row)}>
            <RefreshCw size={16} />
            Renew
          </button>
          <button className="ghost-button danger" onClick={() => cancelMembership(row)}>
            <XCircle size={16} />
            Cancel
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="page">
      <div className="page-header with-actions">
        <div>
          <span className="eyebrow">Access Control</span>
          <h1>Memberships</h1>
          <p>Assign, renew, and cancel member plans.</p>
        </div>
        <button className="primary-button" onClick={() => setModal(true)}>
          <Plus size={18} />
          Assign
        </button>
      </div>

      <DataTable columns={columns} data={memberships} loading={loading} />
      <Pagination pagination={pagination} onPageChange={setPage} />

      <Modal open={modal} title="Assign Membership" onClose={() => setModal(false)}>
        <form className="form-grid" onSubmit={assignMembership}>
          <select value={form.memberId} onChange={(e) => setForm({ ...form, memberId: e.target.value })} required>
            <option value="">Select member</option>
            {members.map((member) => (
              <option value={member._id} key={member._id}>
                {member.name} - {member.phone}
              </option>
            ))}
          </select>
          <select value={form.planId} onChange={(e) => setForm({ ...form, planId: e.target.value })} required>
            <option value="">Select plan</option>
            {plans.map((plan) => (
              <option value={plan._id} key={plan._id}>
                {plan.name}
              </option>
            ))}
          </select>
          <button className="primary-button full" type="submit">
            Assign Membership
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Memberships;
