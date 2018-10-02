import MessageFormat from 'messageformat';

export default async function({
  loadLocale = () => ({}),
  defaultLocale,
  formatters = {},
} = {}) {
  const messages = {};

  if (!defaultLocale && typeof navigator !== 'undefined') {
    defaultLocale = navigator.language;
  }
  let currentLocale = defaultLocale;
  if (currentLocale) {
    await loadLocaleAndCompile(currentLocale);
  }

  return {
    localize,
    setCurrentLocale: async locale => {
      if (!messages[locale]) {
        await loadLocaleAndCompile(locale);
      }
    },
    getCurrentLocale: () => currentLocale,
  };

  async function loadLocaleAndCompile(locale) {
    currentLocale = locale;

    const dict = await loadLocale(locale);
    const format = new MessageFormat(locale);
    format.addFormatters(formatters);
    messages[locale] = format.compile(dict);
  }

  function localize(key, params) {
    const fn = messages[currentLocale] && messages[currentLocale][key];
    if (!fn) {
      return key;
    }

    return fn(params);
  }
}
