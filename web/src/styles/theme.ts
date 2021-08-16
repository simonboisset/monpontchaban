const shadowKeyUmbraOpacity = 0.2;
const shadowKeyPenumbraOpacity = 0.14;
const shadowAmbientShadowOpacity = 0.12;

const createShadow = (
  v1: number,
  v2: number,
  v3: number,
  v4: number,
  v5: number,
  v6: number,
  v7: number,
  v8: number,
  v9: number,
  v10: number,
  v11: number,
  v12: number
) =>
  [
    `${v1}px ${v2}px ${v3}px ${v4}px rgba(0,0,0,${shadowKeyUmbraOpacity})`,
    `${v5}px ${v6}px ${v7}px ${v8}px rgba(0,0,0,${shadowKeyPenumbraOpacity})`,
    `${v9}px ${v10}px ${v11}px ${v12}px rgba(0,0,0,${shadowAmbientShadowOpacity})`,
  ].join(',');

const shadows = [
  'none',
  createShadow(0, 2, 1, -1, 0, 1, 1, 0, 0, 1, 3, 0),
  createShadow(0, 3, 1, -2, 0, 2, 2, 0, 0, 1, 5, 0),
  createShadow(0, 3, 3, -2, 0, 3, 4, 0, 0, 1, 8, 0),
  createShadow(0, 2, 4, -1, 0, 4, 5, 0, 0, 1, 10, 0),
  createShadow(0, 3, 5, -1, 0, 5, 8, 0, 0, 1, 14, 0),
  createShadow(0, 3, 5, -1, 0, 6, 10, 0, 0, 1, 18, 0),
  createShadow(0, 4, 5, -2, 0, 7, 10, 1, 0, 2, 16, 1),
  createShadow(0, 5, 5, -3, 0, 8, 10, 1, 0, 3, 14, 2),
  createShadow(0, 5, 6, -3, 0, 9, 12, 1, 0, 3, 16, 2),
  createShadow(0, 6, 6, -3, 0, 10, 14, 1, 0, 4, 18, 3),
  createShadow(0, 6, 7, -4, 0, 11, 15, 1, 0, 4, 20, 3),
  createShadow(0, 7, 8, -4, 0, 12, 17, 2, 0, 5, 22, 4),
  createShadow(0, 7, 8, -4, 0, 13, 19, 2, 0, 5, 24, 4),
  createShadow(0, 7, 9, -4, 0, 14, 21, 2, 0, 5, 26, 4),
  createShadow(0, 8, 9, -5, 0, 15, 22, 2, 0, 6, 28, 5),
  createShadow(0, 8, 10, -5, 0, 16, 24, 2, 0, 6, 30, 5),
  createShadow(0, 8, 11, -5, 0, 17, 26, 2, 0, 6, 32, 5),
  createShadow(0, 9, 11, -5, 0, 18, 28, 2, 0, 7, 34, 6),
  createShadow(0, 9, 12, -6, 0, 19, 29, 2, 0, 7, 36, 6),
  createShadow(0, 10, 13, -6, 0, 20, 31, 3, 0, 8, 38, 7),
  createShadow(0, 10, 13, -6, 0, 21, 33, 3, 0, 8, 40, 7),
  createShadow(0, 10, 14, -6, 0, 22, 35, 3, 0, 8, 42, 7),
  createShadow(0, 11, 14, -7, 0, 23, 36, 3, 0, 9, 44, 8),
  createShadow(0, 11, 15, -7, 0, 24, 38, 3, 0, 9, 46, 8),
];

const space = (marge?: number) => (marge || 0) * 4;
const shadow = (elevation?: number) => shadows[elevation || 0];

export const theme = {
  colors: {
    primary: { main: '#3F51B5', light: '#5C6BC0', dark: '#283593' },
    success: { main: '#4CAF50', light: '#A5D6A7', dark: '#2E7D32' },
    warning: { main: '#FF9800', light: '#FFCC80', dark: '#EF6C00' },
    error: { main: '#F44336', light: '#EF9A9A', dark: '#C62828' },
    background: { main: '#E0E0E0', light: '#F5F5F5', dark: '#BDBDBD' },
    light: { main: 'rgba(255, 255, 255, 0.25)', light: 'rgba(255, 255, 255, 0.12)', dark: 'rgba(255, 255, 255, 0.50)' },
  },
  typography: {
    h1: { size: 26, font: 'Noto Sans', style: 'normal', weight: 500 },
    h5: { size: 14, font: 'Noto Sans', style: 'normal', weight: 600 },
  },
  radius: 5,
  space,
  shadow,
};

export type Theme = typeof theme;
