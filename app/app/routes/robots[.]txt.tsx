export const loader = () => {
  const robotText = `
        User-agent: Googlebot

        User-agent: *
        Allow: /
    
        Sitemap: https://horaires-pont-chaban-delmas.simonboisset.com/sitemap.xml
        `;

  return new Response(robotText, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
    },
  });
};
