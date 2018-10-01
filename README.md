# `around-the-world`

[![Travis](https://img.shields.io/travis/azz/around-the-world.svg?style=flat-square)](https://travis-ci.org/azz/around-the-world)
[![Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![npm](https://img.shields.io/npm/v/around-the-world.svg?style=flat-square)](https://npmjs.org/around-the-world)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square)](https://github.com/semantic-release/semantic-release)
[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](LICENSE)

> Simple to use ICU localization library built on [MessageFormat][]

`around-the-world` is a utility library built on top of [MessageFormat][] that makes it it simple to localize your app.

- [x] Lazily loads localization templates.
- [x] Supports custom formatters.
- [x] Simple API.
- [x] Dynamically change the language.

## Install

With `yarn`:

```shellsession
yarn add around-the-world
```

With `npm`:

```shellsession
npm install --save around-the-world
```

## Usage

### Basics

```js
import aroundTheWorld from 'around-the-world';

(async () => {
  const { localize } = await aroundTheWorld({
    loadLanguage: languageCode => {
      if (languageCode === 'en-US') {
        return {
          hello_world: 'Hello, world!',
        };
      }
      throw new Error('Unknown language!');
    },
  });
})();
```

### Loading From a Server

You can easily fetch string tables from your server using the `loadLanguage` function. It must resolve to an object.

```js
const { localize } = await aroundTheWorld({
  loadLanguage: async languageCode => {
    const response = await fetch(`/i18n/${languageCode}.json`);
    return res.json();
  },
});

localize('hello-world');
```

### Specifying Default Language

You can specify the default language to load using `defaultLanguage`. If you don't supply this, [`navigator.language`](https://mdn.io/navigator.language) is used.

```js
const { localize } = await aroundTheWorld({
  loadLanguage: languageCode => { /* ... */ }

  defaultLanguage: 'en-AU',
});
```

### Changing the Language

You can read the current language at any time by calling `getCurrentLanguage()`, and you can set it by calling `setCurrentLanguage()`. The latter returns a promise that resolves once the language is loaded.

```js
const {
  localize,
  getCurrentLanguage,
  setCurrentLanguage
} = await aroundTheWorld({
  loadLanguage: languageCode => { /* ... */ }
});

getCurrentLanguage(); // 'en-AU'
localize('hello'); // 'Hello'

await setCurrentLanguage('jp');
localize('hello'); // 'こんにちは'
```

### Adding Custom Formatters

`MessageFormat` supports [custom formatters](https://messageformat.github.io/messageformat/page-guide#toc11__anchor), and you can use them with this library!

```js
const { localize } = await aroundTheWorld({
  loadLanguage: languageCode => ({ number: '{value, decimal, 2}' })

  formatters: {
    decimal: (value, locale, arg) => value.toFixed(+arg),
  },
});

localize('number', { value: 12.3456 }); // -> '12.35'
```

[messageformat]: https://github.com/messageformat/messageformat
