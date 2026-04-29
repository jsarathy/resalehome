import { Link } from 'react-router-dom';
import { useMyProperties } from '../../hooks/useProperty';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function SellerProperties() {
  const { properties, loading, error } = useMyProperties();

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div>
      <div className="page-header">
        <h1>My Properties</h1>
        <Link to="/seller/properties/new" className="btn btn-primary">+ Add property</Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {properties.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <p>You haven't listed any properties yet.</p>
            <Link to="/seller/properties/new" className="btn btn-primary" style={{ marginTop: '16px' }}>
              List your first property
            </Link>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Location</th>
                  <th>Type</th>
                  <th>Area (sq ft)</th>
                  <th>Price (₹L)</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {properties.map((p) => (
                  <tr key={p.id}>
                    <td><Link to={`/seller/properties/${p.id}`}>{p.title}</Link></td>
                    <td>{p.location}</td>
                    <td style={{ textTransform: 'capitalize' }}>{p.property_type}</td>
                    <td>{p.area_sqft?.toLocaleString()}</td>
                    <td>₹ {p.asking_price_lakhs} L</td>
                    <td><StatusBadge status={p.status} /></td>
                    <td>
                      <Link to={`/seller/properties/${p.id}/edit`} className="btn btn-secondary btn-sm">
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
