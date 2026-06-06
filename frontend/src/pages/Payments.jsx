import { useEffect, useState } from "react";
import { History, Plus, Trash2 } from "lucide-react";
import { membershipsApi, paymentsApi } from "../api/endpoints.js";
import DataTable from "../components/common/DataTable.jsx";
import Modal from "../components/common/Modal.jsx";
import Pagination from "../components/common/Pagination.jsx";
import { formatCurrency, formatDate, getMemberName } from "../utils/formatters.js";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [memberships, setMemberships] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({
    membershipId: "",
    amount: "",
    paymentMethod: "cash",
    note: "",
  });
  const [history, setHistory] = useState([]);

  const loadPayments = () => {
    setLoading(true);
    paymentsApi
      .list({ page, limit: 8 })
      .then(({ data }) => {
        setPayments(data.data || []);
        setPagination(data.pagination);
      })
      .finally(() => setLoading(false));
  };

  useEffect(loadPayments, [page]);

  useEffect(() => {
    membershipsApi.list({ page: 1, limit: 100 }).then(({ data }) => {
      setMemberships(data.data || []);
    });
  }, []);

  const recordPayment = async (event) => {
    event.preventDefault();
    const { membershipId, ...payload } = form;
    await paymentsApi.create(membershipId, payload);
    setModal(null);
    loadPayments();
  };

  const deletePayment = async (payment) => {
    if (!window.confirm("Delete this payment?")) return;
    await paymentsApi.remove(payment._id);
    loadPayments();
  };

  const showHistory = async (payment) => {
    const memberId = payment.membershipId?.memberId?._id;
    if (!memberId) return;
    const { data } = await paymentsApi.byMember(memberId, { page: 1, limit: 20 });
    setHistory(data.data || []);
    setModal("history");
  };

  const columns = [
    { key: "member", label: "Member", render: getMemberName },
    { key: "amount", label: "Amount", render: (row) => formatCurrency(row.amount) },
    { key: "method", label: "Payment Method", render: (row) => row.paymentMethod },
    { key: "date", label: "Date", render: (row) => formatDate(row.paymentDate) },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="row-actions">
          <button className="icon-button" onClick={() => showHistory(row)}>
            <History size={17} />
          </button>
          <button className="icon-button danger" onClick={() => deletePayment(row)}>
            <Trash2 size={17} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="page">
      <div className="page-header with-actions">
        <div>
          <span className="eyebrow">Revenue Desk</span>
          <h1>Payments</h1>
          <p>Record dues, view history, and manage payment entries.</p>
        </div>
        <button className="primary-button" onClick={() => setModal("record")}>
          <Plus size={18} />
          Record Payment
        </button>
      </div>

      <DataTable columns={columns} data={payments} loading={loading} />
      <Pagination pagination={pagination} onPageChange={setPage} />

      <Modal open={modal === "record"} title="Record Payment" onClose={() => setModal(null)}>
        <form className="form-grid" onSubmit={recordPayment}>
          <select value={form.membershipId} onChange={(e) => setForm({ ...form, membershipId: e.target.value })} required>
            <option value="">Select membership</option>
            {memberships.map((membership) => (
              <option value={membership._id} key={membership._id}>
                {membership.memberId?.name} - {membership.planId?.name}
              </option>
            ))}
          </select>
          <input type="number" placeholder="Amount" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
          <select value={form.paymentMethod} onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}>
            <option value="cash">Cash</option>
            <option value="upi">UPI</option>
          </select>
          <input placeholder="Note" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
          <button className="primary-button full" type="submit">
            Save Payment
          </button>
        </form>
      </Modal>

      <Modal open={modal === "history"} title="Payment History" onClose={() => setModal(null)}>
        <DataTable columns={columns.slice(0, 4)} data={history} loading={false} />
      </Modal>
    </div>
  );
};

export default Payments;
