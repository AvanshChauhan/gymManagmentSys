import { useEffect, useState } from "react";
import { Clock, Pencil, Plus, Trash2 } from "lucide-react";
import { plansApi } from "../api/endpoints.js";
import Modal from "../components/common/Modal.jsx";
import Pagination from "../components/common/Pagination.jsx";
import { formatCurrency } from "../utils/formatters.js";

const emptyPlan = {
  name: "",
  durationInDays: "",
  price: "",
  description: "",
};

const Plans = () => {
  const [plans, setPlans] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyPlan);

  const loadPlans = () => {
    plansApi.list({ page, limit: 8 }).then(({ data }) => {
      setPlans(data.data || []);
      setPagination(data.pagination);
    });
  };

  useEffect(loadPlans, [page]);

  const openForm = (plan) => {
    setSelected(plan || null);
    setForm(plan || emptyPlan);
    setModal(true);
  };

  const savePlan = async (event) => {
    event.preventDefault();
    const payload = {
      ...form,
      durationInDays: Number(form.durationInDays),
      price: Number(form.price),
    };

    if (selected) {
      await plansApi.update(selected._id, payload);
    } else {
      await plansApi.create(payload);
    }

    setModal(false);
    loadPlans();
  };

  const deletePlan = async (plan) => {
    if (!window.confirm(`Delete ${plan.name}?`)) return;
    await plansApi.remove(plan._id);
    loadPlans();
  };

  return (
    <div className="page">
      <div className="page-header with-actions">
        <div>
          <span className="eyebrow">Subscriptions</span>
          <h1>Plans</h1>
          <p>Premium packages and pricing for your gym.</p>
        </div>
        <button className="primary-button" onClick={() => openForm()}>
          <Plus size={18} />
          New Plan
        </button>
      </div>

      <section className="plans-grid">
        {plans.map((plan) => (
          <article className="plan-card" key={plan._id}>
            <div className="plan-card__top">
              <div>
                <h2>{plan.name}</h2>
                <span className={plan.isActive ? "status-badge active" : "status-badge pending"}>
                  {plan.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <Clock size={22} />
            </div>
            <strong>{formatCurrency(plan.price)}</strong>
            <p>{plan.durationInDays} days membership</p>
            <small>{plan.description || "Flexible gym access plan"}</small>
            <div className="row-actions">
              <button className="ghost-button" onClick={() => openForm(plan)}>
                <Pencil size={17} />
                Edit
              </button>
              <button className="ghost-button danger" onClick={() => deletePlan(plan)}>
                <Trash2 size={17} />
                Delete
              </button>
            </div>
          </article>
        ))}
      </section>

      <Pagination pagination={pagination} onPageChange={setPage} />

      <Modal open={modal} title={selected ? "Edit Plan" : "Create Plan"} onClose={() => setModal(false)}>
        <form className="form-grid" onSubmit={savePlan}>
          <input placeholder="Plan name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input type="number" placeholder="Duration in days" value={form.durationInDays} onChange={(e) => setForm({ ...form, durationInDays: e.target.value })} required />
          <input type="number" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
          <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <button className="primary-button full" type="submit">
            Save Plan
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Plans;
