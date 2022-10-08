async function main() {
  const [previewUrl, prNumber] = process.argv.slice(2);
  return previewUrl.replace('preview', `pr-${prNumber}`);
}

main().then(console.log).catch(console.error);
