function Employees() {
  return (
    <div className="container mt-5">

      <h2>Employees</h2>

      <table className="table table-hover mt-4">

        <thead>

          <tr>

            <th>Name</th>

            <th>Department</th>

            <th>Status</th>

          </tr>

        </thead>

        <tbody>

          <tr>

            <td>Ramesh</td>

            <td>Packaging</td>

            <td>Available</td>

          </tr>

        </tbody>

      </table>

    </div>
  );
}

export default Employees;