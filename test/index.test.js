import aroundTheWorld from '../src';

Object.defineProperty(window.navigator, 'language', {
  value: 'de',
});

test('returns public api', async () => {
  const {
    localize,
    setCurrentLanguage,
    getCurrentLanguage,
  } = await aroundTheWorld();

  expect(localize).toMatchInlineSnapshot(`[Function]`);
  expect(setCurrentLanguage).toMatchInlineSnapshot(`[Function]`);
  expect(getCurrentLanguage).toMatchInlineSnapshot(`[Function]`);
});

test('language defaults to navigator.language', async () => {
  const { getCurrentLanguage } = await aroundTheWorld();

  expect(getCurrentLanguage()).toEqual('de');
});

test('respects defaultLanguage option', async () => {
  const { getCurrentLanguage } = await aroundTheWorld({
    defaultLanguage: 'fr-CA',
  });

  expect(getCurrentLanguage()).toEqual('fr-CA');
});

test('setCurrentLanguage() sets the language', async () => {
  const { getCurrentLanguage, setCurrentLanguage } = await aroundTheWorld();

  await setCurrentLanguage('en-US');

  expect(getCurrentLanguage()).toEqual('en-US');
});

test('aroundTheWorld() calls loadLanguage()', async () => {
  const loadLanguage = jest.fn().mockResolvedValue({});
  await aroundTheWorld({ loadLanguage });

  expect(loadLanguage).toHaveBeenCalledWith('de');
});

test('localize() uses loaded language', async () => {
  const { localize } = await aroundTheWorld({
    loadLanguage: () => ({
      hello_world: 'Hello, world',
    }),
  });

  expect(localize('hello_world')).toEqual('Hello, world');
});

test('localize() returns key if language not loaded', async () => {
  const { localize, setCurrentLanguage } = await aroundTheWorld({
    loadLanguage: async lang => {
      await 'next tick';
      switch (lang) {
        case 'de':
          return { hello_world: 'Hallo Welt' };
        case 'en-US':
          return { hello_world: 'Hello, world' };
      }
    },
  });

  expect(localize('hello_world')).toEqual('Hallo Welt');

  let promise = setCurrentLanguage('en-US');

  expect(localize('hello_world')).toEqual('hello_world');

  await promise;

  expect(localize('hello_world')).toEqual('Hello, world');
});

test('localize() interpolates basic {PARAM}s', async () => {
  const { localize } = await aroundTheWorld({
    loadLanguage: () => ({
      best_franchise_is: `The best franchise is {franchise}`,
    }),
  });

  expect(localize('best_franchise_is', { franchise: 'Stargate' })).toEqual(
    'The best franchise is Stargate'
  );
});

test('supports custom formatters', async () => {
  const { localize } = await aroundTheWorld({
    loadLanguage: () => ({ last_price: 'Last price: {value, decimal, 2}' }),
    formatters: {
      decimal: (value, locale, arg) => value.toFixed(+arg),
    },
  });

  expect(localize('last_price', { value: 12.3456 })).toEqual(
    'Last price: 12.35'
  );
});
