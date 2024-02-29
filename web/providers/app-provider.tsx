import { StoreProvider } from './store-provider';

export function AppProvider({ children }: React.PropsWithChildren) {
  return <StoreProvider>{children}</StoreProvider>;
}
