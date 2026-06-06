import { useEffect, useState } from "react";
import DataTable from "../../components/common/DataTable.jsx";
import { memberSelfApi } from "../../api/endpoints.js";
import { formatCurrency, formatDate } from "../../utils/formatters.js";

const MemberPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    memberSelfApi
      .payments()
      .then(({ data }) => setPayments(data.data || []))
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    {
      key: "amount",
      label: "Amount",
      render: (row) => formatCurrency(row.amount),
    },
    { key: "date", label: "Date", render: (row) => formatDate(row.paymentDate) },
    { key: "method", label: "Payment Method", render: (row) => row.paymentMethod },
  ];

  return (
    <div className="page member-page">
      <div className="page-header">
        <div>
          <span className="eyebrow">Payments</span>
          <h1>Payment History</h1>
          <p>Review previous payments and methods.</p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={payments}
        loading={loading}
        emptyText="No payments found"
      />
    </div>
  );
};

export default MemberPayments;
