import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useMyEnquiries } from '../../hooks/useEnquiry';
import { useEffect, useState } from 'react';
import { getLoanApplicationsByParticipant } from '../../lib/firestore';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function BuyerDashboard() {
  const { user, userProfile } = useAuth();
  const { enquiries, loading: eLoading } = useMyEnquiries();
  const [loans, setLoans]   = useState([]);
  const [lLoading, setLLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    getLoanApplicationsByParticipant(user.uid)
      .then(setLoans)
      .finally(() => setLLoading(false));
  }, [user]);

  if (eLoading || lLoading) return <LoadingSpinner fullPage />;

  const active = enquiries.filter((e) => !['closed'].includes(e.status)).length;

  return (
    <div>
      <div className="page-header">
        <h1>Welcome back, {userProfile?.name?.split(' ')[0]}</h1>
        <Link to="/buyer/browse" className="btn btn-primary">Browse properties</Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-value">{enquiries.length}</span>
          <span className="stat-label">Total enquiries</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{active}</span>
          <span className="stat-label">Active enquiries</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{loans.length}</span>
          <span className="stat-label">Loan applications</span>
        </div>
      </div>

      <div className="card">
        <h2 style={{ marginBottom: '16px' }}>Recent enquiries</h2>
        {enquiries.length === 0 ? (
          <div className="empty-state">
            <p>No enquiries yet. Browse properties to get started.</p>
            <Link to="/buyer/browse" className="btn btn-primary" style={{ marginTop: '16px' }}>
              Browse now
            </Link>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Property</th><th>Message</th><th>Status</th></tr></thead>
              <tbody>
                {enquiries.slice(0, 5).map((e) => (
                  <tr key={e.id}>
                    <td>{e.propertyId}</td>
                    <td style={{ maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {e.message}
                    </td>
                    <td>{e.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
