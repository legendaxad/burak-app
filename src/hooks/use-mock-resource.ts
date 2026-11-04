import { useCallback, useEffect, useState } from 'react';

interface ResourceState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
}

export function useMockResource<T>(loader: (key?: string) => Promise<T>, key?: string): ResourceState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await loader(key));
    } catch {
      setError('We couldn’t load this right now. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [key, loader]);

  useEffect(() => { void reload(); }, [reload]);

  return { data, loading, error, reload };
}
