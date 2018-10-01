import MessageFormat from 'messageformat';

export default async function({
  loadLanguage = () => ({}),
  defaultLanguage,
  formatters = {},
} = {}) {
  const messages = {};

  if (!defaultLanguage && typeof navigator !== 'undefined') {
    defaultLanguage = navigator.language;
  }
  let currentLanguage = defaultLanguage;
  if (currentLanguage) {
    await loadLanguageAndCompile(currentLanguage);
  }

  return {
    localize,
    setCurrentLanguage: async language => {
      if (!messages[language]) {
        await loadLanguageAndCompile(language);
      }
    },
    getCurrentLanguage: () => currentLanguage,
  };

  async function loadLanguageAndCompile(languageCode) {
    currentLanguage = languageCode;

    const dict = await loadLanguage(languageCode);
    const format = new MessageFormat(languageCode);
    format.addFormatters(formatters);
    messages[languageCode] = format.compile(dict);
  }

  function localize(key, params) {
    const fn = messages[currentLanguage] && messages[currentLanguage][key];
    if (!fn) {
      return key;
    }

    return fn(params);
  }
}
