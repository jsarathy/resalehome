import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Modal from './Modal';
import RegisterForm from './RegisterForm';

export default function PublicNav() {
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [modalOpen, setModalOpen]   = useState(false);
  const [success, setSuccess]       = useState(false);
  const [successRef, setSuccessRef] = useState('');
  const { user, userProfile }       = useAuth();
  const navigate                    = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const openModal = () => {
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

  const dashboardPath = userProfile?.role ? `/${userProfile.role}/dashboard` : '/login';

  return (
    <>
      <header className={`pub-header${scrolled ? ' scrolled' : ''}`}>

        {/* ── Row 1: Logo + auth ── */}
        <div className="pub-header-top">
          <div className="container">
            <div className="header-top-inner">
              <Link to="/" className="nav-logo" aria-label="resalehome.com home">
                <span className="nav-logo-word">resalehome</span>
                <span className="nav-logo-tld">.com</span>
              </Link>

              <div className="header-auth">
                {user ? (
                  <Link to={dashboardPath} className="btn btn-primary btn-sm">
                    Dashboard
                  </Link>
                ) : (
                  <>
                    <Link to="/login" className="btn btn-secondary btn-sm">
                      Sign in
                    </Link>
                    <button className="btn btn-primary btn-sm" onClick={openModal}>
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
          </div>
        </div>

        {/* ── Row 2: CTA strip ── */}
        <div className="pub-cta-strip">
          <div className="container">
            <div className="cta-strip-inner">
              <div className="cta-strip-text">
                <strong>Ready to take the first step?</strong>
                <span>No obligation, no pressure.</span>
              </div>
              <div className="cta-strip-actions">
                <button className="btn btn-white btn-sm" onClick={openModal}>
                  Register my property
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <a href="#contact" className="btn btn-white-outline btn-sm">Contact us</a>
              </div>
            </div>
          </div>
        </div>

        {/* ── Row 3: Horizontal nav links ── */}
        <nav className="pub-nav-links-bar" aria-label="Site navigation">
          <div className="container">
            <ul className="pub-nav-links" role="list">
              <li><a href="/#dilemma">For Sellers</a></li>
              <li><Link to="/listings">Browse Properties</Link></li>
              <li><a href="/#valuation">How it Works</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>
        </nav>

        {/* ── Mobile drawer ── */}
        <div className={`nav-mobile${mobileOpen ? ' open' : ''}`} aria-label="Mobile navigation">
          <div className="container">
            <a href="/#dilemma"  onClick={() => setMobileOpen(false)}>For Sellers</a>
            <Link to="/listings" onClick={() => setMobileOpen(false)}>Browse Properties</Link>
            <a href="/#valuation" onClick={() => setMobileOpen(false)}>How it Works</a>
            <a href="#contact"   onClick={() => setMobileOpen(false)}>Contact</a>
            {user
              ? <Link to={dashboardPath} className="btn btn-primary" onClick={() => setMobileOpen(false)}>Dashboard</Link>
              : <button className="btn btn-primary" onClick={() => { setMobileOpen(false); openModal(); }}>List my property</button>
            }
          </div>
        </div>

      </header>

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
