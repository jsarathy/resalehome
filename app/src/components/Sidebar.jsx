import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import styles from './Sidebar.module.css';

const NAV = {
  seller: [
    { to: '/seller/dashboard',   label: 'Dashboard' },
    { to: '/seller/properties',  label: 'My Properties' },
    { to: '/seller/enquiries',   label: 'Enquiries' },
    { to: '/seller/valuations',  label: 'Valuations' },
  ],
  buyer: [
    { to: '/buyer/dashboard',    label: 'Dashboard' },
    { to: '/buyer/browse',       label: 'Browse Properties' },
    { to: '/buyer/enquiries',    label: 'My Enquiries' },
    { to: '/buyer/loans',        label: 'Loan Applications' },
  ],
  rm: [
    { to: '/rm/dashboard',       label: 'Dashboard' },
    { to: '/rm/properties',      label: 'Assigned Properties' },
    { to: '/rm/enquiries',       label: 'Enquiries' },
    { to: '/rm/valuations',      label: 'Valuations' },
  ],
  admin: [
    { to: '/admin/dashboard',    label: 'Dashboard' },
    { to: '/admin/users',        label: 'Users' },
    { to: '/seller/properties',  label: 'All Properties' },
    { to: '/rm/enquiries',       label: 'All Enquiries' },
  ],
};

export default function Sidebar({ open }) {
  const { role } = useAuth();
  const links = NAV[role] ?? [];

  return (
    <aside className={`${styles.sidebar} ${open ? styles.open : ''}`}>
      <span className={styles.roleLabel}>{role?.toUpperCase()}</span>
      <nav>
        <ul>
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `${styles.link} ${isActive ? styles.active : ''}`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
