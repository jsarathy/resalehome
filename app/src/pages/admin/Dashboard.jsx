import { useEffect, useState } from 'react';
import { getAllUsers } from '../../lib/firestore';
import { getDocs, collection, getCountFromServer } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import LoadingSpinner from '../../components/LoadingSpinner';

async function collectionCount(name) {
  const snap = await getCountFromServer(collection(db, name));
  return snap.data().count;
}

export default function AdminDashboard() {
  const [stats, setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getAllUsers(),
      collectionCount('properties'),
      collectionCount('enquiries'),
      collectionCount('valuations'),
      collectionCount('loanApplications'),
    ]).then(([users, properties, enquiries, valuations, loans]) => {
      const byRole = users.reduce((acc, u) => {
        acc[u.role] = (acc[u.role] ?? 0) + 1;
        return acc;
      }, {});
      setStats({ total: users.length, byRole, properties, enquiries, valuations, loans });
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div>
      <div className="page-header"><h1>Admin dashboard</h1></div>

      <span className="section-label" style={{ marginBottom: '12px', display: 'block' }}>Platform overview</span>
      <div className="stats-grid" style={{ marginBottom: '32px' }}>
        <div className="stat-card">
          <span className="stat-value">{stats.total}</span>
          <span className="stat-label">Total users</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats.properties}</span>
          <span className="stat-label">Properties</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats.enquiries}</span>
          <span className="stat-label">Enquiries</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats.valuations}</span>
          <span className="stat-label">Valuations</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats.loans}</span>
          <span className="stat-label">Loan applications</span>
        </div>
      </div>

      <div className="card">
        <h2 style={{ marginBottom: '16px' }}>Users by role</h2>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Role</th><th>Count</th></tr></thead>
            <tbody>
              {Object.entries(stats.byRole).map(([role, count]) => (
                <tr key={role}>
                  <td style={{ textTransform: 'capitalize' }}>{role}</td>
                  <td>{count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
