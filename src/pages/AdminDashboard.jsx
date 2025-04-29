import { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      const res = await axios.get('http://localhost:5000/api/reports/all');
      setReports(res.data);
    };
    fetchReports();
  }, []);

  return (
    <div>
      <h2>All Reports</h2>
      {reports.map((r, i) => (
        <div key={i}>
          <p>{r.location} - {r.type}</p>
          <p>{r.description}</p>
          <img src={r.imageUrl} alt="waste" width="200" />
        </div>
      ))}
    </div>
  );
};

export default AdminDashboard;
