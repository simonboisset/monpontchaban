export const loader = async () => {
  const content = `
          <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
            <url>
              <loc>https://pont-chaban-delmas.com/</loc>
              <lastmod>2023-04-26</lastmod>
              <changefreq>daily</changefreq>
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
