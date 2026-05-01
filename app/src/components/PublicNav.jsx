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

        {/* ── Row 1: Logo + nav links + auth — all in one flex row ── */}
        <div className="pub-topbar">
          <div className="container">
            <div className="pub-topbar-inner">

              <Link to="/" className="nav-logo" aria-label="resalehome.com home">
                <span className="nav-logo-word">resalehome</span>
                <span className="nav-logo-tld">.com</span>
              </Link>

              {/* Horizontal nav links — inside the same flex row as logo */}
              <nav className="pub-nav-links" aria-label="Site navigation">
                <a href="/#dilemma">For Sellers</a>
                <Link to="/listings">Browse Properties</Link>
                <Link to="/?valuation=open">How it Works</Link>
                <a href="#contact">Contact</a>
              </nav>

              <div className="pub-topbar-auth">
                {user ? (
                  <Link to={dashboardPath} className="btn btn-primary btn-sm">
                    Dashboard
                  </Link>
                ) : (
                  <>
                    <Link to="/login" className="btn btn-secondary btn-sm">Sign in</Link>
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
            <div className="pub-cta-strip-inner">
              <span className="pub-cta-strip-text">
                <strong>Ready to take the first step?</strong>
                <span className="pub-cta-strip-sub">No obligation, no pressure.</span>
              </span>
              <div className="pub-cta-strip-actions">
                <button className="btn btn-white btn-sm" onClick={openModal}>
                  Register my property
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <a href="#contact" className="btn btn-white-outline btn-sm">Contact us</a>
              </div>
            </div>
          </div>
        </div>

        {/* ── Mobile drawer ── */}
        {mobileOpen && (
          <div className="pub-mobile-drawer" aria-label="Mobile navigation">
            <div className="container">
              <a href="/#dilemma"   onClick={() => setMobileOpen(false)}>For Sellers</a>
              <Link to="/listings"  onClick={() => setMobileOpen(false)}>Browse Properties</Link>
              <Link to="/?valuation=open" onClick={() => setMobileOpen(false)}>How it Works</Link>
              <a href="#contact"    onClick={() => setMobileOpen(false)}>Contact</a>
              {user
                ? <Link to={dashboardPath} className="btn btn-primary" onClick={() => setMobileOpen(false)}>Dashboard</Link>
                : <button className="btn btn-primary" onClick={() => { setMobileOpen(false); openModal(); }}>List my property</button>
              }
            </div>
          </div>
        )}

      </header>

      <Modal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setSuccess(false); }}
        title={success ? undefined : 'Register your property'}
        subtitle={success ? undefined : 'One of our advisors will contact you within 24 hours.'}
        maxWidth={640}
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
