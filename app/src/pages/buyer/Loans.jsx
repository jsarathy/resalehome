import { useEffect, useState } from 'react';
import { getLoanApplicationsByParticipant, createLoanApplication } from '../../lib/firestore';
import { useAuth } from '../../hooks/useAuth';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';

const BANKS = ['SBI', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra Bank', 'Bank of Baroda', 'Canara Bank'];

export default function BuyerLoans() {
  const { user } = useAuth();
  const [loans, setLoans]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]       = useState({ propertyId: '', bank_name: 'SBI', amount_lakhs: '' });
  const [saving, setSaving]   = useState(false);

  const loadLoans = () => {
    if (!user) return;
    getLoanApplicationsByParticipant(user.uid)
      .then(setLoans)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadLoans(); }, [user]);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createLoanApplication({
        ...form,
        amount_lakhs:    Number(form.amount_lakhs),
        buyerUid:        user.uid,
        assignedRMUid:   null,
        participantUids: [user.uid],
      });
      setShowForm(false);
      setForm({ propertyId: '', bank_name: 'SBI', amount_lakhs: '' });
      loadLoans();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div>
      <div className="page-header">
        <h1>Loan applications</h1>
        <button className="btn btn-primary" onClick={() => setShowForm((v) => !v)}>
          {showForm ? 'Cancel' : '+ New application'}
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {showForm && (
        <div className="card" style={{ maxWidth: '480px', marginBottom: '24px' }}>
          <h2 style={{ marginBottom: '16px' }}>New loan application</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-field">
              <label>Property ID</label>
              <input name="propertyId" value={form.propertyId} onChange={handleChange} placeholder="Firestore property document ID" required />
            </div>
            <div className="form-field">
              <label>Bank</label>
              <select name="bank_name" value={form.bank_name} onChange={handleChange}>
                {BANKS.map((b) => <option key={b}>{b}</option>)}
              </select>
            </div>
            <div className="form-field">
              <label>Loan amount (₹ Lakhs)</label>
              <input name="amount_lakhs" type="number" value={form.amount_lakhs} onChange={handleChange} min="1" required />
            </div>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Submitting…' : 'Submit application'}
            </button>
          </form>
        </div>
      )}

      <div className="card">
        {loans.length === 0 ? (
          <div className="empty-state"><p>No loan applications yet.</p></div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Property</th>
                  <th>Bank</th>
                  <th>Amount (₹L)</th>
                  <th>Status</th>
                  <th>Applied</th>
                </tr>
              </thead>
              <tbody>
                {loans.map((l) => (
                  <tr key={l.id}>
                    <td>{l.propertyId}</td>
                    <td>{l.bank_name}</td>
                    <td>₹ {l.amount_lakhs} L</td>
                    <td><StatusBadge status={l.status} /></td>
                    <td style={{ fontSize: '12px', color: 'var(--color-muted)' }}>
                      {l.createdAt?.toDate?.()?.toLocaleDateString() ?? '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
