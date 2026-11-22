import type { PropsWithChildren } from 'react';

// En iOS y Android no hay marco: la app ocupa toda la pantalla como siempre.
// La versión web está en WebShell.web.tsx.
export function WebShell({ children }: PropsWithChildren) {
  return <>{children}</>;
}
