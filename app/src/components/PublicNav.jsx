import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Modal from './Modal';
import RegisterForm from './RegisterForm';

export default function PublicNav() {
  const [scrolled, setScrolled]         = useState(false);
  const [mobileOpen, setMobileOpen]     = useState(false);
  const [modalOpen, setModalOpen]       = useState(false);
  const [success, setSuccess]           = useState(false);
  const [successRef, setSuccessRef]     = useState('');
  const { user, userProfile }           = useAuth();
  const navigate                        = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleListProperty = () => {
    if (user) {
      navigate('/seller/properties/new');
    } else {
      setSuccess(false);
      setModalOpen(true);
    }
  };

  const handleSuccess = (ref) => {
    setSuccessRef(ref);
    setSuccess(true);
  };

  const dashboardPath = userProfile?.role
    ? `/${userProfile.role}/dashboard`
    : '/login';

  return (
    <>
      <nav className={`pub-nav${scrolled ? ' scrolled' : ''}`} aria-label="Main navigation">
        <div className="container">
          <div className="nav-inner">
            <Link to="/" className="nav-logo" aria-label="resalehome.com home">
              <span className="nav-logo-word">resalehome</span>
              <span className="nav-logo-tld">.com</span>
            </Link>

            <ul className="nav-links" role="list">
              <li><a href="/#dilemma">For Sellers</a></li>
              <li><Link to="/listings">Browse Properties</Link></li>
              <li><a href="/#valuation">How it Works</a></li>
              <li><a href="/#contact">Contact</a></li>
            </ul>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {user ? (
                <Link to={dashboardPath} className="btn btn-primary" style={{ padding: '9px 18px', fontSize: '14px' }}>
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/login" className="btn btn-secondary" style={{ padding: '9px 18px', fontSize: '14px' }}>
                    Sign in
                  </Link>
                  <button className="btn btn-primary" style={{ padding: '9px 18px', fontSize: '14px' }} onClick={handleListProperty}>
                    List my property
                  </button>
                </>
              )}
            </div>

            <button
              className="nav-hamburger"
              aria-label="Toggle navigation"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
            >
              <span /><span /><span />
            </button>
          </div>

          <div className={`nav-mobile${mobileOpen ? ' open' : ''}`} aria-label="Mobile navigation">
            <a href="/#dilemma" onClick={() => setMobileOpen(false)}>For Sellers</a>
            <Link to="/listings" onClick={() => setMobileOpen(false)}>Browse Properties</Link>
            <a href="/#valuation" onClick={() => setMobileOpen(false)}>How it Works</a>
            <a href="/#contact" onClick={() => setMobileOpen(false)}>Contact</a>
            {user
              ? <Link to={dashboardPath} className="btn btn-primary" onClick={() => setMobileOpen(false)}>Dashboard</Link>
              : <button className="btn btn-primary" onClick={() => { setMobileOpen(false); handleListProperty(); }}>List my property</button>
            }
          </div>
        </div>
      </nav>

      <Modal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setSuccess(false); }}
        title={success ? undefined : 'Register your property'}
        subtitle={success ? undefined : 'One of our advisors will contact you within 24 hours.'}
      >
        {success ? (
          <div className="modal-success">
            <div className="success-icon">✓</div>
            <p className="success-title">Thank you — we'll be in touch within 24 hours.</p>
            <p className="success-sub">Your enquiry has been received and an advisor will call you shortly.</p>
            <span className="success-ref">Reference: {successRef}</span>
          </div>
        ) : (
          <RegisterForm onSuccess={handleSuccess} />
        )}
      </Modal>
    </>
  );
}
