# `around-the-world`

[![Travis](https://img.shields.io/travis/azz/around-the-world.svg?style=flat-square)](https://travis-ci.org/azz/around-the-world)
[![Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![npm](https://img.shields.io/npm/v/around-the-world.svg?style=flat-square)](https://npmjs.org/around-the-world)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square)](https://github.com/semantic-release/semantic-release)
[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](LICENSE)

> Simple to use ICU localization library built for [MessageFormat][]

`around-the-world` is a utility library built for [MessageFormat][] that makes it it simple to localize your app.

- [x] Lazily loads localization templates.
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

### Loading From a Server

You can easily fetch string tables from your server using the `loadLocale` function and dynamic imports.
The format is expected to be produced by the [MessageFormat][] compiler.

```js
const { localize } = await aroundTheWorld({
  loadLocale: locale => import(`/i18n/${locale}.js`),
});

localize('hello-world');
```

### Compiling in the Client

You can compile ICU messages in the client directly with `MessageFormat#compile`.

```js
import aroundTheWorld from 'around-the-world';
import MessageFormat from 'messageformat';

(async () => {
  const { localize } = await aroundTheWorld({
    loadLocale: locale => {
      if (locale === 'en-US') {
        const mf = new MessageFormat(locale);
        return mf.compile({
          hello_world: 'Hello, world!',
        });
      }
      throw new Error('Unknown locale!');
    },
  });
})();
```

### Specifying Default Locale

You can specify the default locale to load using `defaultLocale`. If you don't supply this, [`navigator.language`](https://mdn.io/navigator.language) is used.

```js
const { localize } = await aroundTheWorld({
  loadLocale: locale => {
    /* ... */
  },

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
localize('hello'); // 'こんにちは'
```

[messageformat]: https://github.com/messageformat/messageformat
