import { useMyProperties } from '../../hooks/useProperty';
import { updateProperty } from '../../lib/firestore';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Link } from 'react-router-dom';

const STATUSES = ['draft', 'listed', 'under_offer', 'sold'];

export default function RMProperties() {
  const { properties, loading, error, reload } = useMyProperties();

  const updateStatus = async (id, status) => {
    await updateProperty(id, { status });
    reload();
  };

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div>
      <div className="page-header"><h1>Assigned properties</h1></div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card">
        {properties.length === 0 ? (
          <div className="empty-state"><p>No properties assigned to you yet.</p></div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Location</th>
                  <th>Price (₹L)</th>
                  <th>Status</th>
                  <th>Update status</th>
                </tr>
              </thead>
              <tbody>
                {properties.map((p) => (
                  <tr key={p.id}>
                    <td><Link to={`/seller/properties/${p.id}`}>{p.title}</Link></td>
                    <td>{p.location}</td>
                    <td>₹ {p.asking_price_lakhs} L</td>
                    <td><StatusBadge status={p.status} /></td>
                    <td>
                      <select
                        value={p.status}
                        onChange={(e) => updateStatus(p.id, e.target.value)}
                        style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '13px' }}
                      >
                        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
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
