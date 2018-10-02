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
- [x] Dynamically change the locale.

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
    loadLocale: locale => {
      if (locale === 'en-US') {
        return {
          hello_world: 'Hello, world!',
        };
      }
      throw new Error('Unknown locale!');
    },
  });
})();
```

### Loading From a Server

You can easily fetch string tables from your server using the `loadLocale` function. It must resolve to an object.

```js
const { localize } = await aroundTheWorld({
  loadLocale: async locale => {
    const response = await fetch(`/i18n/${locale}.json`);
    return res.json();
  },
});

localize('hello-world');
```

### Specifying Default Locale

You can specify the default locale to load using `defaultLocale`. If you don't supply this, [`navigator.language`](https://mdn.io/navigator.language) is used.

```js
const { localize } = await aroundTheWorld({
  loadLocale: locale => { /* ... */ }

  defaultLocale: 'en-AU',
});
```

### Changing the Locale

You can read the current locale at any time by calling `getCurrentLocale()`, and you can set it by calling `setCurrentLocale()`. The latter returns a promise that resolves once the locale is loaded.

```js
const { localize, getCurrentLocale, setCurrentLocale } = await aroundTheWorld({
  loadLocale: locale => {
    /* ... */
  },
});

getCurrentLocale(); // 'en-AU'
localize('hello'); // 'Hello'

await setCurrentLocale('jp');
localize('hello'); // 'こんにちは'
```

### Adding Custom Formatters

`MessageFormat` supports [custom formatters](https://messageformat.github.io/messageformat/page-guide#toc11__anchor), and you can use them with this library!

```js
const { localize } = await aroundTheWorld({
  loadLocale: locale => ({ number: '{value, decimal, 2}' })

  formatters: {
    decimal: (value, locale, arg) => value.toFixed(+arg),
  },
});

localize('number', { value: 12.3456 }); // -> '12.35'
```

[messageformat]: https://github.com/messageformat/messageformat
