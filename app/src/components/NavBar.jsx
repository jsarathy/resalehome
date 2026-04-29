import { Link } from 'react-router-dom';
import { signOut } from '../lib/auth';
import { useAuth } from '../hooks/useAuth';
import styles from './NavBar.module.css';

export default function NavBar({ onMenuToggle }) {
  const { userProfile } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className={styles.navbar}>
      <div className={styles.left}>
        <button className={styles.menuBtn} onClick={onMenuToggle} aria-label="Toggle sidebar">
          <span /><span /><span />
        </button>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoWord}>resalehome</span>
          <span className={styles.logoTld}>.com</span>
        </Link>
      </div>
      <div className={styles.right}>
        {userProfile && (
          <span className={styles.userName}>{userProfile.name}</span>
        )}
        <button className="btn btn-secondary btn-sm" onClick={handleSignOut}>
          Sign out
        </button>
      </div>
    </header>
  );
}
