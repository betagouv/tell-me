module.exports = {
  compiler: {
    styledComponents: true,
  },
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
  swcMinify: true,
  webpack: config => {
    // https://formatjs.io/docs/guides/advanced-usage#webpackconfigjs
    // eslint-disable-next-line no-param-reassign
    config.resolve.alias['@formatjs/icu-messageformat-parser'] = '@formatjs/icu-messageformat-parser/no-parser'

    return config
  },
}
