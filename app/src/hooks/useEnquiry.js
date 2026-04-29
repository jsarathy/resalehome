import { useEffect, useState, useCallback } from 'react';
import {
  getEnquiriesByParticipant,
  getEnquiriesByProperty,
} from '../lib/firestore';
import { useAuth } from './useAuth';

export function useMyEnquiries() {
  const { user } = useAuth();
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  const load = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await getEnquiriesByParticipant(user.uid);
      setEnquiries(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { load(); }, [load]);
  return { enquiries, loading, error, reload: load };
}

export function usePropertyEnquiries(propertyId) {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  const load = useCallback(async () => {
    if (!propertyId) return;
    try {
      setLoading(true);
      const data = await getEnquiriesByProperty(propertyId);
      setEnquiries(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [propertyId]);

  useEffect(() => { load(); }, [load]);
  return { enquiries, loading, error, reload: load };
}
