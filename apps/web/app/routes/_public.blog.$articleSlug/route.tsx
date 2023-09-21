import { DataFunctionArgs, redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useRoot } from '~/domain/theme';
import { Md } from '~/ui/md';
import { articles } from './articles';

export const loader = async ({ params }: DataFunctionArgs) => {
  const articleSlug = params.articleSlug;

  if (!articleSlug || !articles[articleSlug]) {
    throw redirect(`/blog`);
  }

  return { article: articles[articleSlug].content };
};

export default function Docs() {
  const { article } = useLoaderData<typeof loader>();
  const { currentStatus } = useRoot();

  return (
    <div className='pb-24'>
      <Md text={article} currentStatus={currentStatus} />
    </div>
  );
}
