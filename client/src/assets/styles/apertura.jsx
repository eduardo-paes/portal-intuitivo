import AperturaBlack from '../fonts/apertura-black.woff2';
import AperturaBold from '../fonts/apertura-bold.woff2';
import AperturaMedium from '../fonts/apertura-medium.woff2';
import AperturaObliq from '../fonts/apertura-obliq.woff2';
import AperturaRegular from '../fonts/apertura-regular.woff2';

const aperturaBlack = {
  fontFamily: 'apertura',
  fontStyle: 'normal',
  fontDisplay: 'swap',
  fontWeight: 700,
  src: `
    local('Apertura'),
    local('Apertura-Black'),
    url(${AperturaBlack}) format('woff2')
  `,
  unicodeRange:
    'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF',
};

const aperturaBold = {
  fontFamily: 'apertura',
  fontStyle: 'normal',
  fontDisplay: 'swap',
  fontWeight: 600,
  src: `
    local('Apertura'),
    local('Apertura-Bold'),
    url(${AperturaBold}) format('woff2')
  `,
  unicodeRange:
    'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF',
};

const aperturaMedium = {
  fontFamily: 'apertura',
  fontStyle: 'normal',
  fontDisplay: 'swap',
  fontWeight: 500,
  src: `
    local('Apertura'),
    local('Apertura-Medium'),
    url(${AperturaMedium}) format('woff2')
  `,
  unicodeRange:
    'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF',
};

const aperturaRegular = {
  fontFamily: 'apertura',
  fontStyle: 'normal',
  fontDisplay: 'swap',
  fontWeight: 400,
  src: `
    local('Apertura'),
    local('Apertura-Regular'),
    url(${AperturaRegular}) format('woff2')
  `,
  unicodeRange:
    'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF',
};

const aperturaObliq = {
  fontFamily: 'apertura',
  fontStyle: 'normal',
  fontDisplay: 'swap',
  fontWeight: 300,
  src: `
    local('Apertura'),
    local('Apertura-Obliq'),
    url(${AperturaObliq}) format('woff2')
  `,
  unicodeRange:
    'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF',
};

export {
  aperturaBlack,
  aperturaBold,
  aperturaMedium,
  aperturaRegular,
  aperturaObliq,
};