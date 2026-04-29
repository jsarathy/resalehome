import { useMyEnquiries } from '../../hooks/useEnquiry';
import { updateEnquiry } from '../../lib/firestore';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';

const STATUSES = ['new', 'contacted', 'viewing_scheduled', 'offer_made', 'closed'];

export default function RMEnquiries() {
  const { enquiries, loading, error, reload } = useMyEnquiries();

  const updateStatus = async (id, status) => {
    await updateEnquiry(id, { status });
    reload();
  };

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div>
      <div className="page-header"><h1>Enquiries</h1></div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card">
        {enquiries.length === 0 ? (
          <div className="empty-state"><p>No enquiries assigned to you yet.</p></div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Property</th>
                  <th>Message</th>
                  <th>Status</th>
                  <th>Update status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {enquiries.map((e) => (
                  <tr key={e.id}>
                    <td>{e.propertyId}</td>
                    <td style={{ maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {e.message}
                    </td>
                    <td><StatusBadge status={e.status} /></td>
                    <td>
                      <select
                        value={e.status}
                        onChange={(ev) => updateStatus(e.id, ev.target.value)}
                        style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '13px' }}
                      >
                        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
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
