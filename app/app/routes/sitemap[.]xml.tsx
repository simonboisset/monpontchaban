export const loader = async () => {
  const content = `
          <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
            <url>
              <loc>https://pont-chaban-delmas.com/</loc>
              <lastmod>2022-06-24</lastmod>
              <changefreq>monthly</changefreq>
              <priority>1.0</priority>
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
