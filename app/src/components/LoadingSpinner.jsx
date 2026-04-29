import styles from './LoadingSpinner.module.css';

export default function LoadingSpinner({ fullPage = false }) {
  if (fullPage) {
    return (
      <div className={styles.fullPage}>
        <span className={styles.spinner} aria-label="Loading" />
      </div>
    );
  }
  return <span className={styles.spinner} aria-label="Loading" />;
}
