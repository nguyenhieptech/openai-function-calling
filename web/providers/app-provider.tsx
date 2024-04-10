import { TooltipProvider } from '@/components/ui/tooltip';
import { StoreProvider } from './store-provider';
import { TanstackQueryProvider } from './tanstack-query-provider';
import { ThemeProvider } from './theme-provider';

export function AppProvider({ children }: React.PropsWithChildren) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <TanstackQueryProvider>
        <StoreProvider>
          <TooltipProvider delayDuration={0}>{children}</TooltipProvider>
        </StoreProvider>
      </TanstackQueryProvider>
    </ThemeProvider>
  );
}
