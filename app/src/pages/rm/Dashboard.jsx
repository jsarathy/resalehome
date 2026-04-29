import { useAuth } from '../../hooks/useAuth';
import { useMyProperties } from '../../hooks/useProperty';
import { useMyEnquiries } from '../../hooks/useEnquiry';
import { useEffect, useState } from 'react';
import { getValuationsByParticipant } from '../../lib/firestore';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function RMDashboard() {
  const { user, userProfile } = useAuth();
  const { properties, loading: pLoading } = useMyProperties();
  const { enquiries,  loading: eLoading } = useMyEnquiries();
  const [valuations, setValuations] = useState([]);
  const [vLoading, setVLoading]     = useState(true);

  useEffect(() => {
    if (!user) return;
    getValuationsByParticipant(user.uid)
      .then(setValuations)
      .finally(() => setVLoading(false));
  }, [user]);

  if (pLoading || eLoading || vLoading) return <LoadingSpinner fullPage />;

  const pendingValuations = valuations.filter((v) => v.status !== 'complete').length;
  const openEnquiries     = enquiries.filter((e) => !['closed'].includes(e.status)).length;

  return (
    <div>
      <div className="page-header">
        <h1>RM Dashboard — {userProfile?.name}</h1>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-value">{properties.length}</span>
          <span className="stat-label">Assigned properties</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{openEnquiries}</span>
          <span className="stat-label">Open enquiries</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{pendingValuations}</span>
          <span className="stat-label">Pending valuations</span>
        </div>
      </div>

      <div className="card">
        <h2 style={{ marginBottom: '16px' }}>Quick links</h2>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link to="/rm/properties" className="btn btn-secondary">View assigned properties</Link>
          <Link to="/rm/enquiries"  className="btn btn-secondary">Manage enquiries</Link>
          <Link to="/rm/valuations" className="btn btn-secondary">Process valuations</Link>
        </div>
      </div>
    </div>
  );
}
