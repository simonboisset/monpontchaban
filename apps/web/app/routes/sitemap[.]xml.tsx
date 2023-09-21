import dayjs from 'dayjs';
import { articles } from './_public.blog.$articleSlug/articles';

export const loader = async () => {
  const currentDateFormated = dayjs().format('YYYY-MM-DD');
  const articlesList = [];
  for (const key in articles) {
    if (Object.prototype.hasOwnProperty.call(articles, key)) {
      const element = articles[key];
      articlesList.push({
        slug: element.slug,
        date: element.date,
      });
    }
  }

  const content = `
          <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
            <url>
              <loc>https://www.pont-chaban-delmas.com</loc>
              <lastmod>${currentDateFormated}</lastmod>
              <changefreq>daily</changefreq>
              <priority>1.0</priority>
            </url>
            <url>
              <loc>https://pont-chaban-delmas.com</loc>
              <lastmod>${currentDateFormated}</lastmod>
              <changefreq>daily</changefreq>
              <priority>1.0</priority>
            </url>
            <url>
              <loc>https://pont-chaban-delmas.com/blog</loc>
              <lastmod>${currentDateFormated}</lastmod>
              <changefreq>daily</changefreq>
              <priority>0.8</priority>
            </url>
            <url>
              <loc>https://www.pont-chaban-delmas.com/blog</loc>
              <lastmod>${currentDateFormated}</lastmod>
              <changefreq>daily</changefreq>
              <priority>0.8</priority>
            </url>
            ${articlesList.map(
              ({ slug, date }) => `
            <url>
              <loc>https://pont-chaban-delmas.com/blog/${slug}</loc>
              <lastmod>${date}</lastmod>
              <changefreq>monthly</changefreq>
              <priority>0.7</priority>
            </url>
            <url>
              <loc>https://www.pont-chaban-delmas.com/blog/${slug}</loc>
              <lastmod>${date}</lastmod>
              <changefreq>monthly</changefreq>
              <priority>0.7</priority>
            </url>
            `,
            )}
            <url>
              <loc>https://pont-chaban-delmas.com/docs/legal</loc>
              <lastmod>${currentDateFormated}</lastmod>
              <changefreq>monthly</changefreq>
              <priority>0.5</priority>
            </url>
            <url>
              <loc>https://www.pont-chaban-delmas.com/docs/legal</loc>
              <lastmod>${currentDateFormated}</lastmod>
              <changefreq>monthly</changefreq>
              <priority>0.5</priority>
            </url>
            <url>
              <loc>https://pont-chaban-delmas.com/docs/privacy</loc>
              <lastmod>${currentDateFormated}</lastmod>
              <changefreq>monthly</changefreq>
              <priority>0.5</priority>
            </url>
            <url>
              <loc>https://www.pont-chaban-delmas.com/docs/privacy</loc>
              <lastmod>${currentDateFormated}</lastmod>
              <changefreq>monthly</changefreq>
              <priority>0.5</priority>
            </url>
          </urlset>
      `;

  return new Response(content, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'xml-version': '1.0',
      encoding: 'UTF-8',
    },
  });
};
