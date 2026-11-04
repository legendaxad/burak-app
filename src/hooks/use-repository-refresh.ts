import { useEffect } from 'react';

import { burakRepository } from '@/services/burakRepository';

type Collection = 'products' | 'orders';

export function useRepositoryRefresh(collection: Collection, reload: () => Promise<void>) {
  useEffect(() => burakRepository.subscribe(collection, () => { void reload(); }), [collection, reload]);
}
