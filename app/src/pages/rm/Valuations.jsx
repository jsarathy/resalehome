import { useEffect, useState } from 'react';
import { getValuationsByParticipant, updateValuation } from '../../lib/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../lib/firebase';
import { useAuth } from '../../hooks/useAuth';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function RMValuations() {
  const { user } = useAuth();
  const [valuations, setValuations] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [uploading, setUploading]   = useState({});
  const [forms, setForms]           = useState({});

  const load = () => {
    if (!user) return;
    getValuationsByParticipant(user.uid)
      .then(setValuations)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [user]);

  const handleFormChange = (id, field, value) =>
    setForms((f) => ({ ...f, [id]: { ...(f[id] ?? {}), [field]: value } }));

  const handleUpload = async (valId, file) => {
    if (!file) return;
    setUploading((u) => ({ ...u, [valId]: true }));
    try {
      const storageRef = ref(storage, `valuations/${valId}/${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      handleFormChange(valId, 'report_url', url);
    } catch (e) {
      setError(e.message);
    } finally {
      setUploading((u) => ({ ...u, [valId]: false }));
    }
  };

  const handleComplete = async (valId) => {
    const f = forms[valId] ?? {};
    await updateValuation(valId, {
      status:         'complete',
      valuedAt_lakhs: Number(f.valuedAt_lakhs) || null,
      valuedBy:       f.valuedBy ?? null,
      report_url:     f.report_url ?? null,
    });
    load();
  };

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div>
      <div className="page-header"><h1>Valuations</h1></div>

      {error && <div className="alert alert-error">{error}</div>}

      {valuations.length === 0 ? (
        <div className="card"><div className="empty-state"><p>No valuations assigned.</p></div></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {valuations.map((v) => (
            <div key={v.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <h3>Property: {v.propertyId}</h3>
                  <p style={{ fontSize: '12px', color: 'var(--color-muted)', marginTop: '4px' }}>
                    Requested: {v.createdAt?.toDate?.()?.toLocaleDateString() ?? '—'}
                  </p>
                </div>
                <StatusBadge status={v.status} />
              </div>

              {v.status !== 'complete' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-field">
                    <label>Valued at (₹ Lakhs)</label>
                    <input
                      type="number"
                      value={forms[v.id]?.valuedAt_lakhs ?? ''}
                      onChange={(e) => handleFormChange(v.id, 'valuedAt_lakhs', e.target.value)}
                      placeholder="85"
                    />
                  </div>
                  <div className="form-field">
                    <label>Valued by (engineer name)</label>
                    <input
                      type="text"
                      value={forms[v.id]?.valuedBy ?? ''}
                      onChange={(e) => handleFormChange(v.id, 'valuedBy', e.target.value)}
                      placeholder="Er. Ravi Kumar"
                    />
                  </div>
                  <div className="form-field">
                    <label>Upload report (PDF)</label>
                    <input
                      type="file" accept=".pdf"
                      onChange={(e) => handleUpload(v.id, e.target.files[0])}
                    />
                    {uploading[v.id] && <span style={{ fontSize: '12px' }}>Uploading…</span>}
                    {forms[v.id]?.report_url && (
                      <a href={forms[v.id].report_url} target="_blank" rel="noreferrer" style={{ fontSize: '12px' }}>
                        Report uploaded ✓
                      </a>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleComplete(v.id)}
                      disabled={!forms[v.id]?.valuedAt_lakhs}
                    >
                      Mark as complete
                    </button>
                  </div>
                </div>
              )}

              {v.status === 'complete' && (
                <div style={{ fontSize: '14px', color: 'var(--color-muted)' }}>
                  <p>Valued at: <strong>₹ {v.valuedAt_lakhs} L</strong> by {v.valuedBy}</p>
                  {v.report_url && <a href={v.report_url} target="_blank" rel="noreferrer">Download report</a>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
