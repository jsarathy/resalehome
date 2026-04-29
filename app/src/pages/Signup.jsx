import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signUp } from '../lib/auth';
import styles from './Auth.module.css';

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm]     = useState({ name: '', email: '', phone: '', password: '', role: 'seller' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signUp(form.email, form.password, {
        name: form.name,
        phone: form.phone,
        role: form.role,
      });
      navigate(`/${form.role}/dashboard`, { replace: true });
    } catch (err) {
      setError(err.message ?? 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <span className={styles.logoWord}>resalehome</span>
          <span className={styles.logoTld}>.com</span>
        </div>
        <h1 className={styles.heading}>Create account</h1>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="name">Full name</label>
            <input id="name" name="name" type="text" value={form.name} onChange={handleChange} required />
          </div>
          <div className="form-field">
            <label htmlFor="email">Email address</label>
            <input id="email" name="email" type="email" value={form.email} onChange={handleChange} required autoComplete="email" />
          </div>
          <div className="form-field">
            <label htmlFor="phone">Mobile number</label>
            <input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="+91 98765 43210" required />
          </div>
          <div className="form-field">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" value={form.password} onChange={handleChange} required minLength={8} autoComplete="new-password" />
          </div>
          <div className="form-field">
            <label htmlFor="role">I am a</label>
            <select id="role" name="role" value={form.role} onChange={handleChange}>
              <option value="seller">Seller</option>
              <option value="buyer">Buyer</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className={styles.switchLink}>
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
