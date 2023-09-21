import { DataFunctionArgs } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { cn } from '~/utils';
import { articles } from '../_public.blog.$articleSlug/articles';

export const loader = async ({ request, params }: DataFunctionArgs) => {
  const articlesList = [];
  for (const key in articles) {
    if (Object.prototype.hasOwnProperty.call(articles, key)) {
      const element = articles[key];
      articlesList.push({
        slug: element.slug,
        title: getTitleFromMarkdown(element.content),
        preview: getPreviewFromMarkdown(element.content),
        img: getImgFromMarkdown(element.content),
      });
    }
  }
  return { articlesList };
};

export default function Docs() {
  const { articlesList } = useLoaderData<typeof loader>();

  return (
    <div className='py-44 flex flex-col gap-12'>
      {articlesList.map((art) => (
        <Link
          to={art.slug}
          key={art.slug}
          className={cn(
            'bg-background/60 drop-shadow-lg rounded-2xl shadow-xl p-4 max-w-2xl mx-auto flex flex-col duration-300',
            'sm:flex-row items-start gap-6 hover:bg-background/80 transition-all ease-in-out hover:-translate-y-1 hover:scale-105',
          )}>
          <img
            src={art.img}
            alt={art.title}
            className='sm:w-36 w-full sm:aspect-square aspect-16/9 rounded-xl shadow-xl object-cover'
          />
          <div className='flex-1 flex flex-col gap-2 '>
            <h2 className='text-xl font-bold'>{art.title}</h2>
            <p className='text-sm text-justify'>{art.preview}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}

const getTitleFromMarkdown = (markdown: string) => {
  const title = markdown.match(/# (.*)/)?.[1];
  return title;
};

const getPreviewFromMarkdown = (markdown: string) => {
  const preview =
    markdown
      .match(/\*(.*)/)?.[1]
      .replace(/\[.*\]\(.*\)/g, '')
      .slice(0, 200) + '...';
  return preview;
};

const getImgFromMarkdown = (markdown: string) => {
  const img = markdown.match(/!\[(.*)\]\((.*)\)/)?.[2];
  return img;
};
