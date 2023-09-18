import { Outlet } from '@remix-run/react';
import { useRoot } from '~/domain/theme';
import { cn } from '~/utils';
export default function Docs() {
  const { currentStatus } = useRoot();
  return (
    <div
      className={cn(
        'prose mx-auto prose-p:text-justify prose-a:underline prose-a:font-bold',
        currentStatus === 'OPEN' &&
          'prose-headings:text-success-foreground prose-p:text-success-foreground prose-li:text-success-foreground prose-a:text-success-foreground prose-li:marker:text-success-foreground',
        currentStatus === 'WILL_CLOSE' &&
          'prose-headings:text-warning-foreground prose-p:text-warning-foreground prose-li:text-warning-foreground prose-a:text-warning-foreground prose-li:marker:text-warning-foreground',
        currentStatus === 'CLOSED' &&
          'prose-headings:text-error-foreground prose-p:text-error-foreground prose-li:text-error-foreground prose-a:text-error-foreground prose-li:marker:text-error-foreground',
      )}>
      <Outlet />
    </div>
  );
}
