import { Status } from '@chaban/chaban-core';
import { marked } from 'marked';
import { cn } from '~/utils';

export const Md = ({ text, currentStatus }: { text: string; currentStatus: Status }) => {
  return (
    <div
      className={cn(
        'prose mx-auto prose-p:text-justify prose-a:underline prose-a:font-bold',
        'prose-img:rounded-lg prose-img:shadow-lg prose-img:object-cover prose-img:p-0',
        currentStatus === 'OPEN' &&
          'prose-headings:text-success-foreground prose-p:text-success-foreground prose-li:text-success-foreground prose-a:text-success-foreground prose-li:marker:text-success-foreground',
        currentStatus === 'WILL_CLOSE' &&
          'prose-headings:text-warning-foreground prose-p:text-warning-foreground prose-li:text-warning-foreground prose-a:text-warning-foreground prose-li:marker:text-warning-foreground',
        currentStatus === 'CLOSED' &&
          'prose-headings:text-error-foreground prose-p:text-error-foreground prose-li:text-error-foreground prose-a:text-error-foreground prose-li:marker:text-error-foreground',
      )}>
      <div dangerouslySetInnerHTML={{ __html: marked(text) }} />
    </div>
  );
};
