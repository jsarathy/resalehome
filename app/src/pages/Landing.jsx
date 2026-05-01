import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useAnimateOnScroll } from '../hooks/useAnimateOnScroll';
import Modal from '../components/Modal';
import RegisterForm from '../components/RegisterForm';

export default function Landing() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const pageRef  = useRef(null);
  useAnimateOnScroll(pageRef);

  const [modalOpen, setModalOpen] = useState(false);
  const [success, setSuccess]     = useState(false);
  const [successRef, setSuccessRef] = useState('');

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

  return (
    <div ref={pageRef}>

      {/* ── HERO ── */}
      <section id="hero" className="hero-section" aria-labelledby="hero-heading">
        <div className="container">
          <div className="hero-grid">
            <div className="hero-text">
              <span className="hero-eyebrow">South India's trusted resale platform</span>
              <h1 className="hero-title" id="hero-heading">
                <span className="word-group">Is this the right&nbsp;</span>
                <span className="word-group">price —</span>
                <br />
                <span className="word-group">and the right&nbsp;</span>
                <span className="word-group">time?</span>
              </h1>
              <p className="hero-subheading">
                Every home carries not just square footage, but decades of
                family memory. We help you answer the hardest question
                in property: the dilemma of value.
              </p>
              <div className="hero-cta-row">
                <button className="btn btn-primary" onClick={openModal}>
                  List my property
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <a href="#valuation" className="btn btn-secondary">How it works</a>
              </div>
              <div className="hero-trust">
                <span className="hero-trust-check" aria-hidden="true">✓</span>
                <span>Registered under TNRERA</span>
              </div>
            </div>

            <div className="hero-illustration" aria-hidden="true">
              <svg viewBox="0 0 420 380" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="420" height="380" rx="24" fill="#F7F4F0"/>
                <rect x="60" y="60" width="220" height="260" rx="12" fill="#EDE8E0"/>
                <rect x="90" y="100" width="160" height="180" rx="8" fill="#B87333" opacity="0.18"/>
                <rect x="110" y="130" width="140" height="150" rx="6" fill="#FFFFFF" stroke="#B87333" strokeWidth="1.5"/>
                <polygon points="95,130 180,60 265,130" fill="#B87333" opacity="0.75"/>
                <rect x="158" y="218" width="44" height="62" rx="4" fill="#B87333" opacity="0.35"/>
                <rect x="162" y="222" width="36" height="54" rx="3" fill="#B87333" opacity="0.55"/>
                <circle cx="191" cy="252" r="3" fill="#B87333"/>
                <rect x="122" y="152" width="40" height="36" rx="4" fill="#E6F1FB" stroke="#B87333" strokeWidth="1" opacity="0.9"/>
                <rect x="198" y="152" width="40" height="36" rx="4" fill="#E6F1FB" stroke="#B87333" strokeWidth="1" opacity="0.9"/>
                <line x1="142" y1="152" x2="142" y2="188" stroke="#B87333" strokeWidth="0.75" opacity="0.5"/>
                <line x1="122" y1="170" x2="162" y2="170" stroke="#B87333" strokeWidth="0.75" opacity="0.5"/>
                <line x1="218" y1="152" x2="218" y2="188" stroke="#B87333" strokeWidth="0.75" opacity="0.5"/>
                <line x1="198" y1="170" x2="238" y2="170" stroke="#B87333" strokeWidth="0.75" opacity="0.5"/>
                <rect x="240" y="180" width="120" height="140" rx="10" fill="#1D9E75" opacity="0.12"/>
                <rect x="250" y="195" width="96" height="110" rx="6" fill="#1D9E75" opacity="0.1"/>
                <rect x="262" y="108" width="116" height="48" rx="10" fill="#FFFFFF" stroke="#B87333" strokeWidth="1"/>
                <text x="278" y="128" fontFamily="'DM Sans', sans-serif" fontSize="10" fill="#6B6B67">Certified valuation</text>
                <text x="278" y="146" fontFamily="'Cormorant Garamond', serif" fontSize="14" fontWeight="600" fill="#B87333">₹ Fair market value</text>
                <rect x="28" y="200" width="96" height="40" rx="8" fill="#E1F5EE" stroke="#1D9E75" strokeWidth="1"/>
                <text x="44" y="215" fontFamily="'DM Sans', sans-serif" fontSize="9" fill="#1D9E75" fontWeight="500">✓ TNRERA</text>
                <text x="44" y="230" fontFamily="'DM Sans', sans-serif" fontSize="9" fill="#6B6B67">Registered</text>
                <rect x="80" y="280" width="200" height="6" rx="3" fill="#B87333" opacity="0.15"/>
                <ellipse cx="180" cy="284" rx="90" ry="8" fill="#B87333" opacity="0.07"/>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* ── SELLER'S DILEMMA ── */}
      <section id="dilemma" className="section-pad" aria-labelledby="dilemma-heading">
        <div className="container">
          <article className="dilemma-card">
            <div className="dilemma-header">
              <span className="section-label anim-label">The Seller's Dilemma</span>
              <h2 id="dilemma-heading" className="anim-heading">Three questions before you decide</h2>
            </div>
            <div className="anim-group">
              <div className="dilemma-grid">
                <div className="dilemma-item copper anim-card">
                  <span className="dilemma-num">01</span>
                  <h3>Right price?</h3>
                  <p>Am I exiting at fair market value — or leaving money on the table?</p>
                </div>
                <div className="dilemma-item teal anim-card">
                  <span className="dilemma-num">02</span>
                  <h3>Right time?</h3>
                  <p>Is the market in my favour right now, or should I wait?</p>
                </div>
              </div>
              <div className="dilemma-prose anim-card">
                <p>
                  <strong>Over-leveraged on your portfolio?</strong>{' '}
                  The third question — whether you can sustain holding if your
                  portfolio is over-leveraged — often drives the decision more than price
                  or timing. We help you map all three before you commit to exit.
                </p>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* ── VALUATION FACTORS ── */}
      <section id="valuation" className="section-pad" aria-labelledby="valuation-heading">
        <div className="container">
          <article className="valuation-card">
            <div className="valuation-header">
              <span className="section-label anim-label">What Shapes Your Exit Price</span>
              <h2 id="valuation-heading" className="anim-heading">Key factors in your appraisal</h2>
            </div>
            <div className="pills-grid anim-group">
              <div className="pill anim-card">
                <div className="pill-icon-wrap" aria-hidden="true">
                  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9.5L10 3l7 6.5"/><path d="M5 8v8h10V8"/><path d="M8 16v-4h4v4"/>
                  </svg>
                </div>
                <h3>Property age</h3>
                <p>Structural life, depreciation curve, deferred maintenance load</p>
              </div>
              <div className="pill anim-card">
                <div className="pill-icon-wrap" aria-hidden="true">
                  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3,14 8,9 12,12 17,5"/><polyline points="13,5 17,5 17,9"/>
                  </svg>
                </div>
                <h3>Return on investment</h3>
                <p>Capital appreciation relative to original acquisition cost and holding period costs</p>
              </div>
              <div className="pill anim-card">
                <div className="pill-icon-wrap" aria-hidden="true">
                  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="10" y1="3" x2="10" y2="17"/><line x1="5" y1="17" x2="15" y2="17"/>
                    <line x1="3" y1="7" x2="17" y2="7"/>
                    <path d="M3 7 C3 7 2 10 5 10 C8 10 7 7 7 7"/>
                    <path d="M13 7 C13 7 12 10 15 10 C18 10 17 7 17 7"/>
                  </svg>
                </div>
                <h3>Demand vs. supply</h3>
                <p>Micro-market inventory levels and current absorption rates</p>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section id="services" className="section-pad" aria-labelledby="services-heading">
        <div className="container">
          <article className="services-card">
            <div className="services-header">
              <span className="section-label anim-label">What We Do for You</span>
              <h2 id="services-heading" className="anim-heading">Three pillars of our service</h2>
            </div>
            <div className="service-rows anim-group">
              <div className="service-row anim-card">
                <div className="service-icon-wrap copper" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="7" width="16" height="11" rx="1"/>
                    <path d="M6 18V11h8v7"/><path d="M2 7l8-5 8 5"/>
                    <line x1="10" y1="2" x2="10" y2="7"/>
                  </svg>
                </div>
                <div className="service-body">
                  <h3>Independent property valuation</h3>
                  <p>
                    We engage certified chartered engineers empanelled with leading
                    banks and institutions. They appraise your property on its
                    intrinsic attributes, current market forces, and the local
                    demand-supply position — not just comparable sales.
                  </p>
                </div>
                <span className="service-badge copper">Third-party certified</span>
              </div>
              <div className="service-row anim-card">
                <div className="service-icon-wrap teal" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 16h12"/><path d="M10 5v11"/>
                    <path d="M6 5 C6 5 5 8 8 8 C11 8 10 5 10 5"/>
                    <path d="M10 5 C10 5 9 8 12 8 C15 8 14 5 14 5"/>
                    <line x1="4" y1="5" x2="16" y2="5"/>
                  </svg>
                </div>
                <div className="service-body">
                  <h3>Legal due diligence &amp; title verification</h3>
                  <p>
                    Our empanelled lawyers verify the full encumbrance history,
                    title chain, and regulatory approvals — removing every
                    ambiguity from the transaction for both buyer and seller.
                  </p>
                </div>
                <span className="service-badge teal">Empanelled lawyers</span>
              </div>
              <div className="service-row anim-card">
                <div className="service-icon-wrap blue" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="2" y1="18" x2="18" y2="18"/>
                    <line x1="2" y1="8" x2="18" y2="8"/>
                    <path d="M10 2l8 6H2l8-6z"/>
                    <line x1="5" y1="8" x2="5" y2="18"/>
                    <line x1="10" y1="8" x2="10" y2="18"/>
                    <line x1="15" y1="8" x2="15" y2="18"/>
                  </svg>
                </div>
                <div className="service-body">
                  <h3>Home loan facilitation</h3>
                  <p>
                    We are experts in retail home loans. Through our network of
                    leading banks and financial institutions, we bridge the final
                    gap between a buyer's aspiration and their purchasing power.
                  </p>
                </div>
                <span className="service-badge blue">Leading bank network</span>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* ── TRUST ── */}
      <section id="trust" className="section-pad" aria-labelledby="trust-heading">
        <div className="container">
          <div className="trust-inner">
            <blockquote className="trust-quote anim-card">
              "A house full of family memories deserves a caring new custodian."
            </blockquote>
            <div className="trust-body">
              <p className="anim-card">
                As householders and property owners ourselves, we recognise that real
                estate represents not only a significant investment of hard-earned
                resources, but also a home full of family memories. We are committed
                to providing the best deal for our customers — and to finding a caring
                new custodian for every cherished home.
              </p>
              <p className="anim-card">
                As a matchmaker, we are both responsible and transparent in connecting
                the right buyer to the right seller.
              </p>
            </div>
          </div>
        </div>
      </section>

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
    </div>
  );
}
