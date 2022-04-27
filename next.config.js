module.exports = {
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
      destination: '/api/asset/private',
      source: '/api/asset/private/:fileName*',
    },
    {
      destination: '/api/asset',
      source: '/api/asset/:fileName*',
    },
    {
      destination: '/api/legacy/survey/download',
      source: '/api/legacy/survey/:surveyId*/download',
    },
    {
      destination: '/api/legacy/survey/entries',
      source: '/api/legacy/survey/:surveyId*/entries',
    },
    {
      destination: '/api/legacy/survey/upload',
      source: '/api/legacy/survey/:surveyId*/upload',
    },
    {
      destination: '/api/legacy/survey',
      source: '/api/legacy/survey/:surveyId*',
    },
    {
      destination: '/api/one-time-token',
      source: '/api/one-time-token/:oneTimeTokenId*',
    },
    {
      destination: '/api/personal-access-token',
      source: '/api/personal-access-token/:personalAccessTokenId*',
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
      destination: '/public/legacy/survey',
      source: '/public/legacy/survey/:slug*',
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
}
