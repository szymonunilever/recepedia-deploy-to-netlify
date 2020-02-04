const directUrlsMap = {
  // '/momentos/dia-dia': '/dia-a-dia/',
  //'/cozinha/espanhola': '/espanhola/',
  '/tipos-de-receita/bolo': '/categoria/bolos/',
  '/tipos-de-receita/peixe': '/categoria/peixes/',
  '/tipos-de-receita/carne': '/categoria/carnes/',
  '/tipos-de-receita/massa': '/categoria/massas/',
  '/tipos-de-receita/salada': '/categoria/saladas/',
  '/tipos-de-receita/sopa': '/categoria/sopas/',
  // '/cozinha/portuguesa': '/categoria/portugues/',
  '/cozinha/taiwanesa': '/categoria/asiatica/',
  // '/cozinha/norte-americana': '/categoria/americana/',
  '/tipos-de-prato/lanche': '/categoria/lanches/',
  '/fale-conosco': '/fale-comigo/',
};

const getFromCategoryOrTag = oldSiteFromUrlPartial => {
  const from = `${oldSiteFromUrlPartial}/(?<name>.+)`;

  return [
    {
      from,
      to: '/categoria/?<name>/$',
      otherwise: '/',
    },
    {
      from,
      to: '/?<name>/$',
      otherwise: '/',
    },
  ];
};

const getRedirectRules = () => [
  {
    from: '/receita/[0-9]*-(?<name>.+)',
    to: '/receita/.*/[0-9]*-?<name>/$',
    otherwise: '/receita/',
  },
  {
    from: '/(?<name>.+)/(difficulty|time-day)',
    to: '/?<name>/$',
    otherwise: '/',
  },
  ...Object.keys(directUrlsMap).map(key => ({
    from: key,
    to: directUrlsMap[key],
  })),
  ...[
    '/dietas-especiais',
    '/tipos-de-receita',
    '/tipos-de-prato',
    '/momentos',
    '/cozinha',
  ].reduce((acc, oldSiteFromUrlPartial) => {
    acc.push(...getFromCategoryOrTag(oldSiteFromUrlPartial));
    return acc;
  }, []),
];

// console.log(getRedirectRules());

module.exports = getRedirectRules;
