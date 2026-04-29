import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import { useAuth } from '../hooks/useAuth';
import styles from './PropertyCard.module.css';

export default function PropertyCard({ property }) {
  const { role } = useAuth();
  const basePath = role === 'buyer' ? '/buyer/properties' : `/${role}/properties`;

  return (
    <Link to={`${basePath}/${property.id}`} className={styles.card}>
      <div className={styles.header}>
        <span className={styles.type}>{property.property_type}</span>
        <StatusBadge status={property.status} />
      </div>
      <h3 className={styles.title}>{property.title}</h3>
      <p className={styles.location}>{property.location}</p>
      <div className={styles.meta}>
        <span>{property.area_sqft?.toLocaleString()} sq ft</span>
        {property.bedrooms && <span>{property.bedrooms} BHK</span>}
      </div>
      <div className={styles.price}>₹ {property.asking_price_lakhs} L</div>
    </Link>
  );
}
