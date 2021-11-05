const withNextTranspileModules = require('next-transpile-modules')(['unist-util-find'])

module.exports = withNextTranspileModules({
  eslint: {
    // https://nextjs.org/docs/api-reference/next.config.js/ignoring-eslint
    ignoreDuringBuilds: true,
  },
  headers: async () => [
    {
      headers: [
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
      ],
      source: '/:any*',
    },
  ],
  reactStrictMode: true,
  rewrites: async () => [
    {
      destination: '/api/asset',
      source: '/api/asset/:fileName*',
    },
    {
      destination: '/api/one-time-token',
      source: '/api/one-time-token/:oneTimeTokenId*',
    },
    {
      destination: '/api/refresh-token',
      source: '/api/refresh-token/:refreshTokenId*',
    },
    {
      destination: '/api/survey/download',
      source: '/api/survey/:surveyId*/download',
    },
    {
      destination: '/api/survey/entries',
      source: '/api/survey/:surveyId*/entries',
    },
    {
      destination: '/api/survey/upload',
      source: '/api/survey/:surveyId*/upload',
    },
    {
      destination: '/api/survey',
      source: '/api/survey/:surveyId*',
    },
    {
      destination: '/api/user',
      source: '/api/user/:userId*',
    },
    {
      destination: '/api/404',
      source: '/api/:any*',
    },
    {
      destination: '/public/survey',
      source: '/public/survey/:slug*',
    },
    {
      destination: '/',
      source: '/:any*',
    },
  ],
  webpack: config => {
    // https://formatjs.io/docs/guides/advanced-usage#webpackconfigjs
    // eslint-disable-next-line no-param-reassign
    config.resolve.alias['@formatjs/icu-messageformat-parser'] = '@formatjs/icu-messageformat-parser/no-parser'

    return config
  },
})
