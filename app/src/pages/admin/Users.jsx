import { useEffect, useState } from 'react';
import { getAllUsers, updateUser } from '../../lib/firestore';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';

const ROLES = ['seller', 'buyer', 'rm', 'admin'];

export default function AdminUsers() {
  const [users, setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState('');
  const [saving, setSaving] = useState({});

  const load = () => {
    getAllUsers()
      .then(setUsers)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const changeRole = async (uid, role) => {
    setSaving((s) => ({ ...s, [uid]: true }));
    try {
      await updateUser(uid, { role });
      load();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving((s) => ({ ...s, [uid]: false }));
    }
  };

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div>
      <div className="page-header">
        <h1>Users</h1>
        <span style={{ fontSize: '14px', color: 'var(--color-muted)' }}>{users.length} registered</span>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Change role</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.phone ?? '—'}</td>
                  <td style={{ textTransform: 'capitalize' }}>{u.role}</td>
                  <td>
                    <select
                      value={u.role}
                      disabled={saving[u.id]}
                      onChange={(e) => changeRole(u.id, e.target.value)}
                      style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '13px' }}
                    >
                      {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </td>
                  <td style={{ fontSize: '12px', color: 'var(--color-muted)' }}>
                    {u.createdAt?.toDate?.()?.toLocaleDateString() ?? '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
