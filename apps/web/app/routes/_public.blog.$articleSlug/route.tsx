import { DataFunctionArgs, V2_MetaFunction, redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useRoot } from '~/domain/theme';
import { Md, getPreviewFromMarkdown, getTitleFromMarkdown } from '~/ui/md';
import { articles } from './articles';

export const loader = async ({ params }: DataFunctionArgs) => {
  const articleSlug = params.articleSlug;

  if (!articleSlug || !articles[articleSlug]) {
    throw redirect(`/blog`);
  }

  return { article: articles[articleSlug].content };
};

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => {
  const title = data?.article ? getTitleFromMarkdown(data?.article) : '';
  const preview = data?.article ? getPreviewFromMarkdown(data?.article) : '';
  return [
    { title: `Pont Chaban-Delmas : ${title}` },
    { name: 'description', content: preview },
    { name: 'viewport', content: 'width=device-width,initial-scale=1' },
    { charset: 'utf-8' },
  ];
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
