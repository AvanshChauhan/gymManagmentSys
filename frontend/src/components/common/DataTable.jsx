import LoadingSpinner from "./LoadingSpinner.jsx";

const DataTable = ({ columns, data, loading, emptyText = "No records found" }) => (
  <div className="table-card">
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length}>
                <div className="table-empty">
                  <LoadingSpinner />
                </div>
              </td>
            </tr>
          ) : data.length ? (
            data.map((row) => (
              <tr key={row._id || row.id}>
                {columns.map((column) => (
                  <td key={column.key}>
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length}>
                <div className="table-empty">{emptyText}</div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);

export default DataTable;
