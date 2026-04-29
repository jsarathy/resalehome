import { useAuth } from '../../hooks/useAuth';
import { useMyProperties } from '../../hooks/useProperty';
import { useMyEnquiries } from '../../hooks/useEnquiry';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function SellerDashboard() {
  const { userProfile } = useAuth();
  const { properties, loading: pLoading } = useMyProperties();
  const { enquiries,  loading: eLoading } = useMyEnquiries();

  if (pLoading || eLoading) return <LoadingSpinner fullPage />;

  const listed   = properties.filter((p) => p.status === 'listed').length;
  const pending  = enquiries.filter((e) => e.status === 'new').length;

  return (
    <div>
      <div className="page-header">
        <h1>Welcome back, {userProfile?.name?.split(' ')[0]}</h1>
        <Link to="/seller/properties/new" className="btn btn-primary">+ List a property</Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-value">{properties.length}</span>
          <span className="stat-label">Total properties</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{listed}</span>
          <span className="stat-label">Currently listed</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{enquiries.length}</span>
          <span className="stat-label">Total enquiries</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{pending}</span>
          <span className="stat-label">New enquiries</span>
        </div>
      </div>

      <div className="card">
        <h2 style={{ marginBottom: '16px' }}>Recent properties</h2>
        {properties.length === 0 ? (
          <div className="empty-state">
            <p>No properties yet.</p>
            <Link to="/seller/properties/new" className="btn btn-primary" style={{ marginTop: '16px' }}>
              List your first property
            </Link>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Location</th>
                  <th>Price (₹L)</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {properties.slice(0, 5).map((p) => (
                  <tr key={p.id}>
                    <td><Link to={`/seller/properties/${p.id}`}>{p.title}</Link></td>
                    <td>{p.location}</td>
                    <td>{p.asking_price_lakhs}</td>
                    <td>{p.status}</td>
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
