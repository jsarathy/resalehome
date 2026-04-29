import { useEffect, useState, useCallback } from 'react';
import {
  getPropertiesByParticipant,
  getListedProperties,
  getProperty,
} from '../lib/firestore';
import { useAuth } from './useAuth';

export function useMyProperties() {
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);

  const load = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await getPropertiesByParticipant(user.uid);
      setProperties(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { load(); }, [load]);
  return { properties, loading, error, reload: load };
}

export function useListedProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);

  useEffect(() => {
    getListedProperties()
      .then(setProperties)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { properties, loading, error };
}

export function useProperty(id) {
  const [property, setProperty] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  const load = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await getProperty(id);
      setProperty(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);
  return { property, loading, error, reload: load };
}
