import { useEffect, useState } from "react";
import { Eye, Pencil, Plus, Trash2 } from "lucide-react";
import { useLocation } from "react-router-dom";
import { membersApi, plansApi } from "../api/endpoints.js";
import DataTable from "../components/common/DataTable.jsx";
import Modal from "../components/common/Modal.jsx";
import Pagination from "../components/common/Pagination.jsx";
import SearchBar from "../components/common/SearchBar.jsx";
import { useDebounce } from "../hooks/useDebounce.js";
import { formatCurrency } from "../utils/formatters.js";

const emptyForm = {
  name: "",
  phone: "",
  gender: "male",
  address: "",
  planId: "",
  paymentAmount: "",
  paymentMethod: "cash",
  paymentNote: "",
};

const Members = () => {
  const location = useLocation();
  const [members, setMembers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [selected, setSelected] = useState(null);
  const [plans, setPlans] = useState([]);
  const [error, setError] = useState("");

  const loadMembers = () => {
    setLoading(true);
    const request = debouncedSearch
      ? membersApi.search({ q: debouncedSearch, page, limit: 8 })
      : membersApi.list({ page, limit: 8 });

    request
      .then(({ data }) => {
        setMembers(data.data || []);
        setPagination(data.pagination);
      })
      .finally(() => setLoading(false));
  };

  useEffect(loadMembers, [page, debouncedSearch]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlSearch = params.get("search") || "";

    setSearch(urlSearch);
    setPage(1);
  }, [location.search]);

  useEffect(() => {
    plansApi
      .list({ page: 1, limit: 100 })
      .then(({ data }) => setPlans(data.data || []));
  }, []);

  const openCreate = () => {
    setSelected(null);
    setForm(emptyForm);
    setError("");
    setModal("form");
  };

  const openEdit = (member) => {
    setSelected(member);
    setForm({
      name: member.name || "",
      phone: member.phone || "",
      gender: member.gender || "male",
      address: member.address || "",
      planId: "",
      paymentAmount: "",
      paymentMethod: "cash",
      paymentNote: "",
    });
    setError("");
    setModal("form");
  };

  const openView = (member) => {
    setSelected(member);
    setModal("view");
  };

  const saveMember = async (event) => {
    event.preventDefault();
    setError("");

    try {
      if (selected) {
        await membersApi.update(selected._id, {
          name: form.name,
          phone: form.phone,
          gender: form.gender,
          address: form.address,
        });
      } else {
        await membersApi.create(form);
      }
      setModal(null);
      loadMembers();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to save member");
    }
  };

  const deleteMember = async (member) => {
    if (!window.confirm(`Delete ${member.name}?`)) return;
    await membersApi.remove(member._id);
    loadMembers();
  };

  const columns = [
    { key: "name", label: "Name" },
    { key: "phone", label: "Phone" },
    { key: "gender", label: "Gender" },
    {
      key: "status",
      label: "Membership Status",
      render: () => <span className="status-badge pending">Check membership</span>,
    },
    {
      key: "actions",
      label: "Actions",
      render: (member) => (
        <div className="row-actions">
          <button className="icon-button" onClick={() => openView(member)}>
            <Eye size={17} />
          </button>
          <button className="icon-button" onClick={() => openEdit(member)}>
            <Pencil size={17} />
          </button>
          <button className="icon-button danger" onClick={() => deleteMember(member)}>
            <Trash2 size={17} />
          </button>
        </div>
      ),
    },
  ];
  const selectedPlan = plans.find((plan) => plan._id === form.planId);

  return (
    <div className="page">
      <div className="page-header with-actions">
        <div>
          <span className="eyebrow">Branch Operations</span>
          <h1>Members</h1>
          <p>Search, edit, and manage gym members.</p>
        </div>
        <button className="primary-button" onClick={openCreate}>
          <Plus size={18} />
          Add Member
        </button>
      </div>

      <div className="toolbar">
        <SearchBar value={search} onChange={setSearch} placeholder="Search members" />
      </div>

      <DataTable columns={columns} data={members} loading={loading} />
      <Pagination pagination={pagination} onPageChange={setPage} />

      <Modal
        open={modal === "form"}
        title={selected ? "Edit Member" : "Add Member"}
        onClose={() => setModal(null)}
      >
        <form className="form-grid" onSubmit={saveMember}>
          <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
          <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          <input placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          {!selected && (
            <>
              <div className="form-section-title">Membership</div>
              <select
                value={form.planId}
                onChange={(e) => setForm({ ...form, planId: e.target.value })}
                required
              >
                <option value="">Select plan</option>
                {plans.map((plan) => (
                  <option key={plan._id} value={plan._id}>
                    {plan.name} - {formatCurrency(plan.price)}
                  </option>
                ))}
              </select>
              {selectedPlan && (
                <div className="form-hint">
                  {selectedPlan.durationInDays} days. Pending dues are calculated from the unpaid balance.
                </div>
              )}
              <div className="form-section-title">Initial Payment</div>
              <input
                type="number"
                min="0"
                max={selectedPlan?.price || undefined}
                placeholder="Payment amount"
                value={form.paymentAmount}
                onChange={(e) => setForm({ ...form, paymentAmount: e.target.value })}
                required
              />
              <select
                value={form.paymentMethod}
                onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
              >
                <option value="cash">Cash</option>
                <option value="upi">UPI</option>
              </select>
              <input
                placeholder="Payment note"
                value={form.paymentNote}
                onChange={(e) => setForm({ ...form, paymentNote: e.target.value })}
              />
            </>
          )}
          {error && <div className="form-error">{error}</div>}
          <button className="primary-button full" type="submit">
            {selected ? "Save Member" : "Add Member, Plan & Payment"}
          </button>
        </form>
      </Modal>

      <Modal open={modal === "view"} title="Member Details" onClose={() => setModal(null)}>
        <div className="detail-list">
          <span>Name</span>
          <strong>{selected?.name}</strong>
          <span>Phone</span>
          <strong>{selected?.phone}</strong>
          <span>Gender</span>
          <strong>{selected?.gender || "Not set"}</strong>
          <span>Address</span>
          <strong>{selected?.address || "Not set"}</strong>
        </div>
      </Modal>
    </div>
  );
};

export default Members;
