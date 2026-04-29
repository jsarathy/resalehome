import { Link } from 'react-router-dom';
import styles from './Auth.module.css';

export default function Unauthorized() {
  return (
    <div className={styles.page}>
      <div className={styles.card} style={{ textAlign: 'center' }}>
        <div className={styles.logo} style={{ justifyContent: 'center' }}>
          <span className={styles.logoWord}>resalehome</span>
          <span className={styles.logoTld}>.com</span>
        </div>
        <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Access Denied</h1>
        <p style={{ marginBottom: '24px' }}>You don't have permission to view this page.</p>
        <Link to="/" className="btn btn-primary">Go home</Link>
      </div>
    </div>
  );
}
