export const getPrNumberFromUrl = (url: string): string | undefined => {
  return url.split('preview-')[1]?.split('--')[0];
};
