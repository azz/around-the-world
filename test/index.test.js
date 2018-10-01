import aroundTheWorld from '../src';

Object.defineProperty(window.navigator, 'locale', {
  value: 'de',
});

test('returns public api', async () => {
  const {
    localize,
    setCurrentLocale,
    getCurrentLocale,
  } = await aroundTheWorld();

  expect(localize).toMatchInlineSnapshot(`[Function]`);
  expect(setCurrentLocale).toMatchInlineSnapshot(`[Function]`);
  expect(getCurrentLocale).toMatchInlineSnapshot(`[Function]`);
});

test('locale defaults to navigator.locale', async () => {
  const { getCurrentLocale } = await aroundTheWorld();

  expect(getCurrentLocale()).toEqual('de');
});

test('respects defaultLocale option', async () => {
  const { getCurrentLocale } = await aroundTheWorld({
    defaultLocale: 'fr-CA',
  });

  expect(getCurrentLocale()).toEqual('fr-CA');
});

test('setCurrentLocale() sets the locale', async () => {
  const { getCurrentLocale, setCurrentLocale } = await aroundTheWorld();

  await setCurrentLocale('en-US');

  expect(getCurrentLocale()).toEqual('en-US');
});

test('aroundTheWorld() calls loadLocale()', async () => {
  const loadLocale = jest.fn().mockResolvedValue({});
  await aroundTheWorld({ loadLocale });

  expect(loadLocale).toHaveBeenCalledWith('de');
});

test('localize() uses loaded locale', async () => {
  const { localize } = await aroundTheWorld({
    loadLocale: () => ({
      hello_world: 'Hello, world',
    }),
  });

  expect(localize('hello_world')).toEqual('Hello, world');
});

test('localize() returns key if locale not loaded', async () => {
  const { localize, setCurrentLocale } = await aroundTheWorld({
    loadLocale: async lang => {
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

  let promise = setCurrentLocale('en-US');

  expect(localize('hello_world')).toEqual('hello_world');

  await promise;

  expect(localize('hello_world')).toEqual('Hello, world');
});

test('localize() interpolates basic {PARAM}s', async () => {
  const { localize } = await aroundTheWorld({
    loadLocale: () => ({
      best_franchise_is: `The best franchise is {franchise}`,
    }),
  });

  expect(localize('best_franchise_is', { franchise: 'Stargate' })).toEqual(
    'The best franchise is Stargate'
  );
});

test('supports custom formatters', async () => {
  const { localize } = await aroundTheWorld({
    loadLocale: () => ({ last_price: 'Last price: {value, decimal, 2}' }),
    formatters: {
      decimal: (value, locale, arg) => value.toFixed(+arg),
    },
  });

  expect(localize('last_price', { value: 12.3456 })).toEqual(
    'Last price: 12.35'
  );
});
