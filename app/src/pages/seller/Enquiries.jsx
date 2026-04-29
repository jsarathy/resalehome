import { useMyEnquiries } from '../../hooks/useEnquiry';
import { Link } from 'react-router-dom';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function SellerEnquiries() {
  const { enquiries, loading, error } = useMyEnquiries();

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div>
      <div className="page-header">
        <h1>Enquiries on my listings</h1>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card">
        {enquiries.length === 0 ? (
          <div className="empty-state"><p>No enquiries received yet.</p></div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Property</th>
                  <th>Message</th>
                  <th>Status</th>
                  <th>Received</th>
                </tr>
              </thead>
              <tbody>
                {enquiries.map((e) => (
                  <tr key={e.id}>
                    <td>
                      <Link to={`/seller/properties/${e.propertyId}`}>
                        {e.propertyId}
                      </Link>
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
