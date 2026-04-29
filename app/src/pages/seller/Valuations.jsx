import { useEffect, useState } from 'react';
import { getValuationsByParticipant } from '../../lib/firestore';
import { useAuth } from '../../hooks/useAuth';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function SellerValuations() {
  const { user } = useAuth();
  const [valuations, setValuations] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');

  useEffect(() => {
    if (!user) return;
    getValuationsByParticipant(user.uid)
      .then(setValuations)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div>
      <div className="page-header">
        <h1>Valuation requests</h1>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card">
        {valuations.length === 0 ? (
          <div className="empty-state">
            <p>No valuation requests yet. Request one from a property page.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Property</th>
                  <th>Status</th>
                  <th>Valued at (₹L)</th>
                  <th>Valued by</th>
                  <th>Report</th>
                  <th>Requested</th>
                </tr>
              </thead>
              <tbody>
                {valuations.map((v) => (
                  <tr key={v.id}>
                    <td>{v.propertyId}</td>
                    <td><StatusBadge status={v.status} /></td>
                    <td>{v.valuedAt_lakhs ? `₹ ${v.valuedAt_lakhs} L` : '—'}</td>
                    <td>{v.valuedBy ?? '—'}</td>
                    <td>
                      {v.report_url
                        ? <a href={v.report_url} target="_blank" rel="noreferrer">Download</a>
                        : '—'}
                    </td>
                    <td style={{ fontSize: '12px', color: 'var(--color-muted)' }}>
                      {v.createdAt?.toDate?.()?.toLocaleDateString() ?? '—'}
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
