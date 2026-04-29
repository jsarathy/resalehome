import { Link } from 'react-router-dom';
import styles from './Auth.module.css';

export default function NotFound() {
  return (
    <div className={styles.page}>
      <div className={styles.card} style={{ textAlign: 'center' }}>
        <div className={styles.logo} style={{ justifyContent: 'center' }}>
          <span className={styles.logoWord}>resalehome</span>
          <span className={styles.logoTld}>.com</span>
        </div>
        <h1 style={{ fontSize: '48px', color: 'var(--color-copper)', marginBottom: '8px' }}>404</h1>
        <p style={{ marginBottom: '24px' }}>Page not found.</p>
        <Link to="/" className="btn btn-primary">Go home</Link>
      </div>
    </div>
  );
}
