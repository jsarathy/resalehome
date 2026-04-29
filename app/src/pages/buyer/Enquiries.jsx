import { useMyEnquiries } from '../../hooks/useEnquiry';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Link } from 'react-router-dom';

export default function BuyerEnquiries() {
  const { enquiries, loading, error } = useMyEnquiries();

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div>
      <div className="page-header">
        <h1>My enquiries</h1>
        <Link to="/buyer/browse" className="btn btn-primary">Browse more properties</Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card">
        {enquiries.length === 0 ? (
          <div className="empty-state"><p>No enquiries yet.</p></div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Property</th>
                  <th>My message</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {enquiries.map((e) => (
                  <tr key={e.id}>
                    <td>
                      <Link to={`/buyer/properties/${e.propertyId}`}>{e.propertyId}</Link>
                    </td>
                    <td style={{ maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {e.message}
                    </td>
                    <td><StatusBadge status={e.status} /></td>
                    <td style={{ fontSize: '12px', color: 'var(--color-muted)' }}>
                      {e.createdAt?.toDate?.()?.toLocaleDateString() ?? '—'}
                    </td>
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
