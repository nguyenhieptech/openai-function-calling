'use client';

import { Provider } from 'jotai';

export function StoreProvider({ children }: React.PropsWithChildren) {
  return <Provider>{children}</Provider>;
}
