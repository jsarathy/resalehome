import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="pub-footer" id="contact">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
            <div className="footer-logo">
              <span className="footer-logo-word">resalehome</span>
              <span className="footer-logo-tld">.com</span>
            </div>
            <p className="footer-tagline">South India's trusted resale property platform.</p>
            <p className="footer-reg">TNRERA Registered &nbsp;|&nbsp; &copy; 2025 resalehome.com</p>
          </div>

          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/?dilemma=open">For Sellers</Link></li>
              <li><Link to="/listings">Browse Properties</Link></li>
              <li><Link to="/?valuation=open">How it Works</Link></li>
              <li><Link to="/#trust">About Us</Link></li>
              <li><Link to="/#contact">Contact</Link></li>
              <li><a href="#">Privacy Policy</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Contact</h4>
            <div className="footer-contact">
              <p>Chennai, Tamil Nadu</p>
              <a href="mailto:info@resalehome.com">info@resalehome.com</a>
              <a href="tel:+91XXXXXXXXXX">+91 XXXXX XXXXX</a>
            </div>
          </div>
        </div>

        <p className="footer-bottom">
          resalehome.com is registered under the Tamil Nadu Real Estate Regulatory Authority (TNRERA).
          All transactions facilitated through our platform are subject to applicable laws.
        </p>
      </div>
    </footer>
  );
}
